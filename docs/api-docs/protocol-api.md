# FluxID Protocol Intelligence API

Monitor, segment, and alert on entire user bases. These endpoints are designed for institutions, lending protocols, and marketplaces that need to track ecosystem-wide liquidity health.

---

## 1. Protocol Health
`GET /protocol/health`

Returns aggregate health metrics for the entire tracked protocol, including average trust scores, risk distributions, and deltas (changes) over time.

### Parameters
| Name | Type | Description |
| :--- | :--- | :--- |
| `network` | `string` | `testnet` or `mainnet`. |
| `windowHours` | `number` | Time window for trend calculation (e.g., `720` for 30 days). |

### Use Case
Use this to build "Network Health" dashboards for your stakeholders.

---

## 2. Behavioral Segments
`GET /protocol/segments`

Query wallets based on specific behavioral criteria. This is a powerful filtering tool for risk assessment.

### Query Parameters
| Name | Type | Description |
| :--- | :--- | :--- |
| `minScore` | `number` | Minimum trust score (0-100). |
| `maxScore` | `number` | Maximum trust score. |
| `risk` | `string` | `Low`, `Medium`, or `High`. |
| `activity` | `string` | `low`, `medium`, or `high`. |
| `consistent` | `boolean` | Filter for users with consistent flow patterns. |

---

## 3. Risk Alerts
`GET /protocol/alerts`

Returns active alerts regarding protocol health shifts, trust erosion, or anomalous risk spikes.

### Parameters
| Name | Type | Description |
| :--- | :--- | :--- |
| `lookbackHours` | `number` | How far back to look for anomalies (default `24`). |

### Alert Types
- **Protocol Health Shift**: Significant drop in average score.
- **Anomalous Risk Shift**: High percentage of wallets dropping into "High Risk".
- **Trust Erosion**: Sudden drop below a score of 50 across many wallets.

---

## 4. Cohorts & Heatmaps
- `GET /protocol/cohorts`: Returns count of "Steady Earners", "High Trust", and "Dormant" wallets.
- `GET /protocol/risk-heatmap`: Returns score-band clustering for data visualization.

---

## 5. Management
- `POST /protocol/wallets`: Upload a list of wallets to begin tracking.
- `DELETE /protocol/wallets`: Clear tracked history for a network.
