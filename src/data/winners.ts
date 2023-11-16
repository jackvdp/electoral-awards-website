export interface AwardWinner {
    awardName: string;
    winner: string;
    runnersUp?: string[];
}

export const awards: AwardWinner[] = [
    {
        "awardName": "Electoral Commission of the Year Award",
        "winner": "Central Election Commission of Georgia"
    },
    {
        "awardName": "Electoral Commissioner of the Year Award",
        "winner": "Dr Madhukar Gupta, State Election Commissioner of Rajasthan, India"
    },
    {
        "awardName": "Lifetime Achievement Award",
        "winner": "Mohammad Irfan Abdool Rahman, Electoral Commissioner of Mauritius"
    },
    {
        "awardName": "Sustained Electoral Improvement Award",
        "winner": "Central Electoral Board of the Dominican Republic"
    },
    {
        "awardName": "Election Management Award",
        "winner": "Independent Electoral Commission of Kenya",
        "runnersUp": [
            "Central Election Commission of Georgia",
            "Commission on Elections, Philippines"
        ]
    },
    {
        "awardName": "International Institutional Engagement Award",
        "winner": "Electoral Integrity Project and International IDEA",
        "runnersUp": [
            "Central Electoral Board of the Dominican Republic",
            "State Election Commission, Bihar"
        ]
    },
    {
        "awardName": "Electoral Conflict Management Award",
        "winner": "National Electoral Council Colombia",
        "runnersUp": [
            "Central Election Commission, Georgia",
            "Commission on Elections, Philippines"
        ]
    },
    {
        "awardName": "Posthumous Meritorious Achievement Award",
        "winner": "Luna Shamsuddoha, Dohatec New Media"
    },
    {
        "awardName": "Accessibility for All Award",
        "winner": "The Electoral Tribunal of the Federal Judiciary of Mexico (TEPJF)",
        "runnersUp": [
            "National Electoral Institute of Mexico",
            "Central Electoral Board of the Dominican Republic"
        ]
    },
    {
        "awardName": "First Time Voter Award",
        "winner": "Daniel Stockemer & Aksel Sundstrom",
        "runnersUp": [
            "District Election Office, Koderma, India",
            "State Election Commission, Bihar, India"
        ]
    },
    {
        "awardName": "Citizens’ Engagement Award",
        "winner": "Elections Ontario",
        "runnersUp": [
            "The Coalition for Clean & Fair Elections (BERSIH); Malaysia",
            "Swedish Election Authority"
        ]
    },
    {
        "awardName": "Electoral Ergonomic Award",
        "winner": "Commission on Elections, Philippines",
        "runnersUp": [
            "Independent Electoral Commission of Kenya",
            "State Election Commission, Bihar, India"
        ]
    },
]
