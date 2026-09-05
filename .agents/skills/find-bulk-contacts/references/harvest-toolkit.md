# Harvest toolkit

Working scripts for Passes 3 to 6. Copy into the scratchpad and adjust the keyword lists to the topic. These were used to build a 405-contact energy-planning list from 2,471 raw rows.

## 1. Locate the persisted Hunter results

Save complete Hunter JSON responses as `.txt` files in a temporary directory, using the client’s reported output paths or a local API script. Each file must contain the original `data` object; unwrap tool-result envelopes first.

```bash
TR=/absolute/path/to/saved-hunter-results
ls "$TR"
# sanity check that they are parseable and see what you have
for f in "$TR"/*.txt; do
  jq -r '.data.domain + " | " + (.data.emails|length|tostring) + " emails"' "$f" 2>/dev/null
done
```

File names are arbitrary; glob for `*.txt` and let `jq` skip anything that is not a Domain-Search payload.

## 2. Extract everything to TSV

Never read the JSON directly. This drops generic inboxes and unnamed rows, and dedupes by email.

```bash
OUT=<scratchpad>
: > "$OUT/raw.tsv"
for f in "$TR"/*.txt; do
  jq -r '.data as $d | $d.emails[]?
    | select(.type=="personal")
    | select((.first_name//"")!="" and (.last_name//"")!="")
    | [ $d.domain, ($d.organization // ""),
        ((.first_name // "") + " " + (.last_name // "")),
        (.position_raw // .position // ""),
        (.seniority // ""), (.department // ""),
        .value, (.confidence|tostring), (.verification.status // "") ]
    | @tsv' "$f" 2>/dev/null >> "$OUT/raw.tsv"
done
sort -u -t$'\t' -k7,7 "$OUT/raw.tsv" -o "$OUT/raw.tsv"
wc -l < "$OUT/raw.tsv"
cut -f1 "$OUT/raw.tsv" | sort | uniq -c | sort -rn
```

Columns: `domain, org, name, position, seniority, department, email, confidence, verification`.

Contacts that arrived in context rather than on disk can be hand-written into a `manual.tsv` with the same nine columns and concatenated before the dedupe.

## 3. Organisation metadata

One row per domain. The category drives the specialist/generalist rule, so this is where the judgement lives.

```
domain <TAB> readable org name <TAB> region <TAB> category
```

Categories used for an energy list, adapt the names to the topic:

| Category | Specialist? | Meaning |
|---|---|---|
| `regulator` | yes | Sector regulator |
| `ministry` | yes | Government department owning the policy |
| `agency` | yes | Delivery or implementation agency |
| `regional` | yes | Regional body **dedicated to the topic** |
| `topicbody` | yes | International agency dedicated to the topic |
| `network` | yes | Practitioner or regulator network |
| `devfinance` | no | Development bank |
| `multilateral` | no | General-purpose UN or donor body |
| `ngo` | no | Sector NGO, mixed relevance |
| `uk` | no | Domestic sector body |

Put general-purpose regional bodies (UN regional commissions, the Pacific Community, the Pacific Islands Forum) in `multilateral`, not `regional`. They are not topic bodies and their senior staff are mostly off-topic.

Check every harvested domain has metadata before building:

```bash
cut -f1 "$OUT/raw.tsv" | sort -u > "$OUT/d1"
cut -f1 "$OUT/meta.tsv" | sort -u > "$OUT/d2"
comm -23 "$OUT/d1" "$OUT/d2"   # must be empty
```

## 4. Build the list

```python
import csv, re, os, collections
OUT = os.environ['OUT']

meta = {}
for l in open(f"{OUT}/meta.tsv"):
    d, name, region, cat = l.rstrip("\n").split("\t")
    meta[d] = (name, region, cat)

SPECIALIST = {"regulator","ministry","agency","regional","topicbody","network"}

# --- tune these three to the topic -------------------------------------
JUNK = re.compile(r"intern\b|internship|receptionist|driver|cleaner|janitor|librarian|"
    r"payroll|recruit|talent acquisition|human resource|personal assistant|"
    r"executive assistant|executive secretary|office assistant|administrative assistant|"
    r"office support|office administrator|protocol|catering|security guard|graphic|"
    r"web develop|webmaster|system administrator|helpdesk|help desk|network security|"
    r"ict officer|it officer|it assistant|it system|it support|accountant|bookkeep|"
    r"procurement|supply chain|storekeeper|archivist|translator|photograph|videograph|"
    r"social media|front desk|switchboard|nurse|medical", re.I)
COMMS = re.compile(r"communicat|media|public relations|press officer|spokesperson|"
    r"administrative office|working student|outreach|marketing|fundrais|"
    r"events? (officer|coordinator)", re.I)
TOPIC = re.compile(r"energ|power|electric|renewab|solar|wind|hydro|grid|petroleum|"
    r"\boil\b|\bgas\b|nuclear|biomass|geotherm|climate|carbon|decarbon|sustainab|"
    r"environment|infrastructur|utilit|electrif|efficien|transition|net zero|emission", re.I)
# adjacent specialisms to exclude even inside a specialist org
WRONG = re.compile(r"mining|mineral|geolog|quarry|diamond|mine\b", re.I)
# -----------------------------------------------------------------------

SENIOR = re.compile(r"director|head\b|chief|commissioner|secretary general|"
    r"director-general|director general|executive director|general manager|"
    r"deputy director|principal|lead\b|president|chair", re.I)
MID = re.compile(r"manager|senior|specialist|adviser|advisor|coordinator|officer|"
    r"engineer|analyst|economist|planner|expert|programme|program\b|fellow|"
    r"associate|consultant|technical", re.I)

RATIONALE = {  # one line per category, reused across every row of that org
  "regulator": "National sector regulator. The course modules on regulatory mechanisms, "
               "pricing and access map directly onto this remit.",
  # ... one entry per category in meta.tsv
}

rows = []
for l in open(f"{OUT}/raw.tsv"):
    p = l.rstrip("\n").split("\t")
    p += [""] * (9 - len(p))
    dom, org, name, pos, sen, dep, email, conf, ver = p[:9]
    if dom not in meta:
        continue
    orgname, region, cat = meta[dom]
    pos = pos.strip()
    if not pos or JUNK.search(pos) or COMMS.search(pos):
        continue
    if WRONG.search(pos) and not TOPIC.search(pos):
        continue
    if dep in ("it", "hr", "support", "design", "communication"):
        continue

    on_topic = bool(TOPIC.search(pos))
    spec = cat in SPECIALIST
    if not spec and not on_topic:          # generalist orgs: title must match
        continue

    is_senior, is_mid = bool(SENIOR.search(pos)), bool(MID.search(pos))
    if is_senior and spec:   bucket, rank = "top pick", 0
    elif is_senior or is_mid: bucket, rank = "shortlist", 1
    else:                     bucket, rank = "reserve", 2

    why = RATIONALE[cat]
    if on_topic and not spec:
        why = f"{why} Their role ({pos}) is explicitly on topic."
    status = {"valid": "verified", "accept_all": "accept_all"}.get(ver, "pattern")
    rows.append((rank, -int(conf or 0), dom,
        [name.strip(), pos, orgname, region, bucket, why, email, status,
         f"Hunter Domain-Search, confidence {conf}"]))

# cap per organisation, keeping the best rows
rows.sort(key=lambda r: (r[0], r[1]))
CAP, seen, final = 18, {}, []
for rank, negc, dom, r in rows:
    if seen.get(dom, 0) >= CAP:
        continue
    seen[dom] = seen.get(dom, 0) + 1
    final.append(r)

final.sort(key=lambda r: ({"top pick":0,"shortlist":1,"reserve":2}[r[4]], r[3], r[2]))
with open(f"{OUT}/final.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["Name","Role","Organisation","Region","Bucket",
                "Why they fit","Email","Email status","Source"])
    w.writerows(final)

print("rows:", len(final))
print("buckets:", collections.Counter(r[4] for r in final))
print("status:", collections.Counter(r[7] for r in final))
print("regions:", collections.Counter(r[3] for r in final).most_common())
```

Run it, read the counts, adjust, run again. Expect two or three iterations. Typical attrition: 2,471 raw to 1,546 named and deduped to 1,300 after role exclusions to about 550 after the relevance rule to 405 after capping.

## 5. Inspect before shipping

Counts hide quality problems. Always eyeball a sample:

```python
import csv, random
rows = list(csv.DictReader(open(f"{OUT}/final.csv")))
random.seed(7)
for r in random.sample(rows, 12):
    print(f"[{r['Bucket'][:9]:9}] {r['Name'][:24]:24} | {r['Role'][:48]:48} | {r['Organisation'][:34]}")
```

What this catches, and did: a general-purpose regional body classified as specialist, shipping its gender and urbanisation directors onto an energy list. Grep the output for roles that have nothing to do with the topic and fix the category, not the row.

## 6. Generate addresses from a pattern

For scraped names at thinly-indexed organisations.

```python
import unicodedata, re

def strip_accents(s):
    return "".join(c for c in unicodedata.normalize("NFD", s)
                   if unicodedata.category(c) != "Mn")

def build_email(pattern, first, last, domain):
    """pattern e.g. '{first}.{last}', '{f}{last}', '{first}', '{last}{first}'"""
    f = re.sub(r"[^a-z\-]", "", strip_accents(first).lower())
    l = re.sub(r"[^a-z\-]", "", strip_accents(last).lower())
    local = (pattern.replace("{first}", f).replace("{last}", l)
                    .replace("{f}", f[:1]).replace("{l}", l[:1]))
    return f"{local}@{domain}"
```

Take `pattern` from the org's Domain-Search response. Then verify every generated address with `hunter / Email-Verifier` before it goes into the CSV, and mark it `pattern` unless the verifier returns `valid`.

Multi-part surnames are the main failure mode. Hunter's pattern usually assumes a single token, so "de Silva" or "Osei-Appiah" may need both the hyphenated and concatenated forms tried.

## 7. Spot-verify and record it

Pick roughly 10 `pattern` addresses from distinct domains, run `Email-Verifier` on each, then write the results back so the CSV reflects them:

```python
spot = {"a@x.org": "verified", "b@y.org": "accept_all", "c@z.org": "DROP"}
out = []
for r in csv.DictReader(open(f"{OUT}/final.csv")):
    s = spot.get(r["Email"])
    if s == "DROP":
        continue
    if s:
        r["Email status"] = s
        r["Source"] += "; spot-verified via Hunter Email-Verifier"
    out.append(r)
```

Report the raw sample result to the user, for example "8 valid, 1 risky, 1 undeliverable out of 10", and let them draw the bounce-rate conclusion themselves rather than rounding it into a claim.
