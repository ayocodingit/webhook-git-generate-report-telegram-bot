# Github Action

This application aims to report evidence every time there is a merge request

## Quick Start

Clone project and install dependencies:
```bash
git clone https://github.com/ayocodingit/github-action.git
cd github-action
cp .env.example .env

```

Set Secrets Variable github
```bash
# Endpoint apps github action
EVIDENCE_URL=
# Owner github
EVIDENCE_OWNER=
# Name repo
EVIDENCE_REPO=
# secret key app github action
EVIDENCE_SECRET_KEY=
```

Create workflows github **evidence.yml**

```workflows
name: Evidence CD

on:
  pull_request:
    branches: [ master ]

jobs:
  evidence:
    runs-on: ubuntu-latest
    steps:
    - name: evidence
      uses: enflo/curl-action@master
      with:
        curl: ${{ secrets.EVIDENCE_URL }}?owner=${{ secrets.EVIDENCE_OWNER }}&repo=${{ secrets.EVIDENCE_REPO }}&secret_key=${{ secrets.EVIDENCE_SECRET_KEY }}&pull_number=${{ env.NUMBER }} 
      env: 
        NUMBER: ${{ github.event.number }}
```
