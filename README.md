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

This is a e-club management laravel react inertia project built upon another laravel react inertia project called furniture ecommerce website so please remove all previous page and seeded data and please make this new e-club project admin panel to be like the current admin-layout.tsx at resources/js/Layouts folder and make sure that its the layout for all admin pages not the admin-layout-page.tsx file and also please update the header and footer to be like the screenshot I gave you!!!

Make the website to show a popup model using shadcn-ui component to show the popup on every homepage load as the 1st screenshot I gave you and make sure its responsive and also make sure to add the close button at the top right corner of the popup modal to close the popup and also make sure to add a cookie to not show the popup again if the user closed it once!!!

And you can see the 2nd screenshot so please make the current header to be like the 2nd screenshot I gave you and also make sure to add the search bar in the header as shown in the 2nd screenshot and also make sure to add the cart icon with the number of items in the cart as shown in the 2nd screenshot and also make sure to add the user icon at the top right corner as shown in the 2nd screenshot!!!

And the 3rd and 4th is for footer design so please make the footer to be like the 3rd and 4th screenshot I gave you and also make sure to add the social media icons as shown in the 4th screenshot and also make sure to add the newsletter subscription form as shown in the 4th screenshot!!!

This is a big task so please create tasklist and then after planning complete those todos one by one systematically and this will cost so much token so please make sure to be efficient in your code!!!

Good, now please format and lint all code and then please remove all furniture related code and files from this project!!! But keep the CMS content and use it in this e-club project!!! Make all files and folders names professional and also in this CMS prject please create 2 admin panel component:
1. input.tsx -> it will be a reusable input component for admin panel forms, where it will show current value from the seeded data and updating it will update the seeded data in the database.
2. image.tsx -> it will be a reusable image upload component for admin panel forms, where it will show current image from the seeded data and updating it will update the seeded data in the database. And please make sure to use these 2 components in all admin panel content pages where ever its possible!!!

I gave you 4 screenshots for the header submenus - Please make the header 4 submenus as the screenshots I gave and we also have to make those frontend page for those submenus so please make those pages as well with dummy seeded data for now!!! The 4 submenus are:
1. Committe
2. Membership
3. Events
4. Media
And also make admin panel page to manage the content of these 4 submenus in header admin panel and also create those separate pages to control the content of these 4 submenus related pages in admin panel as well!!!
