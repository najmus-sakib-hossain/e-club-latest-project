# E-Club

E-Club project for nex groups.

## Zip with windows 7-Zip

```bash
"/c/Program Files/7-Zip/7z.exe" a -tzip e-club.zip . '-xr!node_modules' '-xr!.git' -mx=1
```

### Cpanle Deploy

```bash
php artisan key:generate && php artisan migrate:fresh --seed && rm -rf public/storage && php artisan storage:link
```
