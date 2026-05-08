# Contributing Guide

## Branching strategy

- `main`: stable release branch
- `develop`: integration branch for sprint work
- `feature/<module>-<short-description>`: new feature work
- `fix/<module>-<short-description>`: bug fixes
- `hotfix/<short-description>`: urgent production fix

## Branch naming examples

- `feature/auth-jwt-session`
- `feature/admin-users-guard`
- `fix/login-role-redirect`

## Pull request workflow

1. Create a branch from `develop`.
2. Commit atomic changes with clear messages.
3. Open PR to `develop` with:
   - summary
   - acceptance criteria
   - test evidence
4. Require at least 1 approval.
5. Resolve review comments.
6. Merge with squash merge.

## Definition of done

- Build passes for frontend and backend.
- Automated tests pass.
- Swagger updated if API changed.
- README updated if setup/usage changed.
- Role and route security verified.

## Commit convention

- `feat:` new functionality
- `fix:` bug fix
- `refactor:` internal improvement
- `test:` test changes
- `docs:` documentation changes
