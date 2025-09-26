# Admin User Setup

## Default Admin User

The application comes with a default admin user:

- **Email**: `admin@famt.ac.in`
- **Password**: `admin@123`
- **Role**: `admin`

## Admin Management Commands

### Available Scripts

1. **Seed Admin User** (Create default admin if not exists):
   ```bash
   npm run seed:admin
   ```

2. **Update Admin Password**:
   ```bash
   npm run update:admin
   ```

3. **Admin Manager** (Comprehensive admin management):
   ```bash
   npm run admin <command> [options]
   ```

### Admin Manager Commands

#### List all admin users:
```bash
npm run admin list
```

#### Create new admin user:
```bash
npm run admin create <email> <password>
# Example: npm run admin create newadmin@famt.ac.in newpassword123
```

#### Update admin password:
```bash
npm run admin update <email> <password>
# Example: npm run admin update admin@famt.ac.in newpassword123
```

#### Delete admin user:
```bash
npm run admin delete <email>
# Example: npm run admin delete oldadmin@famt.ac.in
```

#### Show help:
```bash
npm run admin
```

## Security Notes

- Admin users have full access to the admin dashboard
- Only users with `@famt.ac.in` email domain can register
- Admin passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- Admin dashboard is protected by role-based access control

## Database

The admin user is stored in the `users` collection with:
- `email`: Admin email address
- `password`: Hashed password
- `role`: Set to "admin"
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

## Troubleshooting

If you cannot login with the default admin credentials:

1. Check if the admin user exists:
   ```bash
   npm run admin list
   ```

2. Update the admin password:
   ```bash
   npm run update:admin
   ```

3. Create a new admin user:
   ```bash
   npm run admin create admin@famt.ac.in admin@123
   ```

## Access

Once logged in with admin credentials, you can access:
- Admin Dashboard: `/admin-dashboard`
- All complaint management features
- User management
- Analytics and reporting
- Export functionality
