export const REQUIRED_FILES = [
  "AGENTS.md",
  "ARCHITECTURE.md",
  "FRONTEND.md",
  "PLANS.md",
  "PRODUCT_SENSE.md",
  "QUALITY_SCORE.md",
  "RELIABILITY.md",
  "SECURITY.md",
  "docs/product-specs/index.md",
  "docs/design-docs/core-beliefs.md",
  "docs/generated/db-schema.md",
] as const;

export const REQUIRED_DIRECTORIES = [
  "docs/design-docs",
  "docs/exec-plans",
  "docs/exec-plans/active",
  "docs/exec-plans/completed",
  "docs/generated",
  "docs/product-specs",
] as const;

export const REQUIRED_GITIGNORE_ENTRIES = [
  "node_modules/",
  ".env.local",
] as const;

export const DOC_PATHS = [
  "ARCHITECTURE.md",
  "docs/product-specs/index.md",
  "docs/design-docs/core-beliefs.md",
  "docs/generated/db-schema.md",
  "FRONTEND.md",
  "PLANS.md",
  "QUALITY_SCORE.md",
  "RELIABILITY.md",
  "SECURITY.md",
] as const;
