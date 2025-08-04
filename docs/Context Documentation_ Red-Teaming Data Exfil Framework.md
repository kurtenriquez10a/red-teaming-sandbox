### **Risk Patterns**

| Risk Pattern | Flow | Key Examples |
| ----- | ----- | ----- |
| **Invisible tool / debug workflows** | Agent executes background actions (terminal calls, curl, image requests) that silently transmit user data. | Malicious GitHub Issue, Fake Website Error |
| **Premature PII auto-fill** | Forms are populated with Drive-sourced PII before user consent, enabling key-logging capture. | Travel & Restaurant booking sites |
| **Trust in low-credibility sources** | Minimal reputation boosts (fresh domains, seeded blog posts) bypass source-credibility checks and trigger unsafe actions. | Charity site with fake “AI policy”, Image-URL exfil pattern |

### 

### 

### 

### 

### 

### 

### **Exfil Scenarios**

| Scenario | Vector | One-liner |
| ----- | ----- | ----- |
| **Malicious GitHub Issue** | curl GET | README-formatter prompt injection pushes repo & Drive data to attacker endpoint. |
| **Fake Travel Agency**  | Form keylogger | Booking page keylogs passport \+ card data auto-filled by Agent. |
| **Fake Restaurant Reservation** | Form keylogger | Auto-fills credit-card & ID details on unvetted dining site. |
| **Image-URL Path Exfil** | GET via URL | Budget data concatenated into image filename and fetched off-site. |
| **Fake Website Error Message** | POST / GET | Agent “fixes” auth error by transmitting API key to attacker server. |

