# Add host aliases

## Usage

```yaml
jobs:
  runs-on: ubuntu-latest
  job:
    - ...
    - name: Checkout github-actions
      uses: actions/checkout@v3
      with:
        repository: cognius/github-actions
        ref: main
        path: .github/shared
    - name: Create host aliases
      uses: ./.github/shared/actions/add-hosts
      env:
        HOSTS: hostname.com,newhostname.com
```
