export interface AwardWinner {
    awardName: string;
    winner: string;
    runnersUp?: string[];
}

export const awards: AwardWinner[] = [
    {
        "awardName": "Electoral Commission of the Year Award",
        "winner": "The Election Commission of Sri Lanka"
    },
    {
        "awardName": "Electoral Commissioner of the Year Award",
        "winner": "George Erwin M. Garcia, Commission in Election Philippines"
    },
    {
        "awardName": "Lifetime Achievement Award",
        "winner": "Tom Rogers, Electoral Commission of Australia"
    },
    {
        "awardName": "ICPS Excellence Award",
        "winner": "Musa Hassan Yousuf, Somaliland National Electoral Commission"
    },
    {
        "awardName": "Election Management Award",
        "winner": "Antigua and Barbuda Electoral Commission",
        "runnersUp": [
            "Chhattisgarh State Electoral Commission",
            "National Electoral Institute of Mexico"
        ]
    },
    {
        "awardName": "International Institutional Engagement Award",
        "winner": "Commission on Elections Philippines",
        "runnersUp": [
            "Tribunal Electoral del Poder Judicial de la Federación (TEPJF)",
            "Zimbabwe Election Support Network"
        ]
    },
    {
        "awardName": "Electoral Conflict Management Award",
        "winner": "Electoral Commission for Sierra Leone",
        "runnersUp": [
            "Consejo Nacional Electoral de Colombia",
            "ISIE – Tunisian Independent High Electoral Commission"
        ]
    },
    {
        "awardName": "Posthumous Meritorious Achievement Award",
        "winner": "Wafula Chebukati"
    },
    {
        "awardName": "Accessibility for All Award",
        "winner": "Electoral Commission of Ghana",
        "runnersUp": [
            "ISIE – Tunisian Independent High Electoral Commission",
            "Tribunal Electoral del Poder Judicial de la Federación (TEPJF)"
        ]
    },
    {
        "awardName": "First Time Voter Award",
        "winner": "Electoral Commission of Namibia",
        "runnersUp": [
            "Commission on Elections Philippines",
            "Tribunal Electoral del Poder Judicial de la Federación (TEPJF)"
        ]
    },
    {
        "awardName": "Citizens’ Engagement Award",
        "winner": "Caroline Vernaillen, Global Forum on Modern Direct Democracy",
        "runnersUp": [
            "G S Sangreshi, State Election Commissioner Karnataka",
            "Zimbabwe Electoral Commission"
        ]
    },
    {
        "awardName": "Electoral Ergonomic Award",
        "winner": "Electoral Management Institute (IGE) and Electoral (TE) Court City of Buenos Aires",
        "runnersUp": [
            "Melatwork Hailu Abebaw & the National Election Board of Ethiopia"
        ]
    },
]
