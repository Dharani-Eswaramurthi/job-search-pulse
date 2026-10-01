# Data handling and interpretation

## Allowed data

The server reads only the Forms submission timestamp and the fixed-choice fields listed in `server/schema.js`. Country is the selected country of residence; age is a broad optional age group. Detailed location, written feedback, contact details, names, employers and “other” free-text inputs are not fetched. Do not add them to the allowlist or public endpoint.

Responses without affirmative participation consent, invalid timestamps or dates before the configured survey round are excluded. Unknown choice labels become missing values. When recent activity is not “Yes,” application-specific fields are cleared, including stale answers left after a respondent changes the branching answer.

The endpoint never returns an individual record. The CSV download contains the same displayed aggregate counts, shares and withheld cells, including the demo/live label. There is no respondent-level export endpoint.

## Publication threshold

The default minimum is 20. A group below this size publishes no total or distributions. A filter value is omitted if its selected cohort or its nonzero complement falls below the minimum. Within a single-answer distribution, a nonzero category below the threshold is withheld. If only one cell would be withheld, one additional visible cell is suppressed to prevent direct subtraction from the chart total. A KPI is withheld when its numerator or its nonzero complement falls below the threshold. Multi-select categories are suppressed independently because they do not form a partition.

Zero counts can appear. Denominators are eligible respondents rather than all submissions. Unknown and excluded answer categories are not presented as substantive outcomes. Withheld data is represented by `null` and a suppression flag, never a hidden exact count.

**This is suppression, not differential privacy or a formal anonymity guarantee.** Overlapping cohort summaries, eligible denominators, weekly counts and changes across releases may still permit inferences. Small-group withholding does not prove that an identity or response is impossible to infer. This starter should not be used for sensitive company allegations or personal histories. For higher privacy requirements, use a reviewed release policy with coarser fixed cohorts, periodic frozen releases and, where appropriate, a formally designed differential-privacy mechanism.

## Survey validity

Respondents are self-selected, their identities are not verified, and anonymous response settings permit repeat submissions. This version cannot deduplicate people without identifiers. Do not claim the totals are verified unique individuals. Recruitment through one subreddit, country or profession can skew the results. Small groups are not necessarily representative even when large enough to display.

Reply bands are ordinal estimates. The site shows the percentage of respondents choosing each band. It does not estimate how many total applications were sent or rejected, nor convert “about half” into a measured 50% application-level rate. Likewise, channel usage cannot identify a platform's hiring success rate. Company ghost-job status cannot be verified from these responses.

## Live operation

The site publishes a changing summary of one survey round. It does not follow a verified longitudinal panel. Weekly counts describe when respondents submitted the form; their underlying application experiences span different reporting windows. Do not label weekly participation as an improving or worsening labor market.

Use a public collection notice consistent with the Form's consent language. Give only trusted owners access to the original Sheet. Decide your raw-response retention period and explain it in the survey notice before broad recruitment. Requests for deletion may be hard to fulfill for an anonymous record that cannot be reliably located; do not promise identity-based deletion unless you implement an appropriate mechanism.

## Technical boundaries

- Google service-account credentials exist only in server environment variables.
- The service account is a Viewer on the response Sheet and requests a read-only OAuth scope.
- User input cannot change the source Sheet, credentials, minimum threshold, date range or column allowlist.
- The public API accepts only a single validated predefined dimension and value.
- Public output is generated from enumerated survey choices, never raw supplied text.
- Cache keys vary with the allowed query parameters; source data is refreshed by server instances.
- Failed live reads never fall back to synthetic data.
- API errors contain no raw Google payloads or credentials. Logs contain fixed error codes only.
- There is no per-IP rate limiter or shared durable cache in this minimal starter. Use hosting protections and monitor quotas before broad distribution.
