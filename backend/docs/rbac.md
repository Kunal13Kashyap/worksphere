# WorkSphere RBAC Matrix

## Projects

| Action | Admin | Manager | Member |
| --- | --- | --- | --- |
| Create Project | ✅ | ✅ | ❌ |
| Read Project | ✅ | ✅ | ✅ |
| Update Project | ✅ | ✅ | ❌ |
| Delete Project | ✅ | ❌ | ❌ |

## Tasks

| Action | Admin | Manager | Member |
| --- | --- | --- | --- |
| Create Task | ✅ | ✅ | ✅ |
| Read Task | ✅ | ✅ | ✅ |
| Update Task Meta | ✅ | ✅ | ❌ |
| Update Task Status | ✅ | ✅ | ✅ (own) |
| Assign Task | ✅ | ✅ | ❌ |
| Delete Task | ✅ | ❌ | ❌ |

## Organization

| Action | Admin | Manager | Member |
| --- | --- | --- | --- |
| Invite User | ✅ | ❌ | ❌ |
| View Org Data | ✅ | ✅ | ✅ |

### Assumptions
- This system uses strict hierarchical RBAC
- Roles are static and equal within their level
- Lower roles can never mutate higher-level user data
- Ownership-based checks are handled separately from RBAC
- No cross-role mutation rules are implemented beyond this matrix