# Example action

Example action

## Usage

```yaml
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - name: Example action
        uses: cognius/github-actions/.github/actions/example@v2
```

## Development

To testing locally without Github Action.

```bash
./.github/actions/example/example.sh
```
