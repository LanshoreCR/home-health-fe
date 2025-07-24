# Quality Audit App Frontend

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the repository

- **Branches:**  
  - Dev -> DevBranch
  - QA -> QABranch
  - Prod -> ProdBranch

```sh
git clone https://github.com/LanshoreCR/QualityAuditAppFE.git
```

### 2. Install dependencies

```sh
yarn install
```

### 3. Run the project

```sh
npm start
```

---

## Details

- **Environment Configuration:**  
  The `.env` file contains all necessary environment variables, including:
  - Okta configuration (`client ID`, `issuer`, and `callback`)
  - API URLs (both deployed and local)
  - Power BI report URL

---

## Azure App Service

- [Dev Environment](BHS_DEV_DigitialOps_QualityAudit_RG -> dev-qualityauditappfrontend)
- [QA Environment](BHS_QA_DigitialOps_QualityAudit_RG -> qa-qualityauditappfrontend)
- [Prod Environment](BHS_PRD_DigitialOps_QualityAudit_RG -> prd-qualityauditappfrontend)

