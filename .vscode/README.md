# Docs

At first please make sure to study the codebase and all attachments correctly then understand the prompt requirements and then create a tasklist and complete those task step by step systematically:

Currently the frontend contact page has "Send us a Message" card so make sure when its clicked submit it will be showen that message details in the admin dashboard new page called "Contact Records" where admin can see all the messages sent by users from the frontend contact us page. So, please create that admin dashboard page and the respective route, controller and model to store those contact messages properly. And admin can make that message state "pending", "in progress" and "resolved" from that admin dashboard page properly. Please make sure to use shadcn-ui components properly with tailwindcss utility classes. And make sure to create responsive design that works perfectly on all devices. PLease create all admin page for controlling all frontend pages content from admin dashboard. And make sure to use typescript properly with all types defined correctly. And make sure to use inertia link and routing so that the website is SPA like and fast. And make sure to use motion for page transition and other animation effects. And make sure to use zod with react-hook-form for form validation properly. And make sure to follow all best professional coding practices with proper folder structure and clean code.

And remember to put that new items in the admin panel sidebar so that admin can access that page properly.

Before doing anything make sure that you understand the project structure and its requirements with all attached files. And create tasklist and finally then complete those tasks one by one systemitically.

As you can help admin page so much less sections than help frontend so please create all missing sections in the admin panel dashboard pages so that admin can control all frontend pages content from there. And if there is cards then from the admin panel help page we can also create more cards and all input text will have frontend default values set from the current frontend page content so admin can change them from there.

And as the admin panel contact page please put card drag and drop to reorder the contact items properly in help admin page and also put icon picker to select icon for each contact item properly like the contact admin page in the help admin page too!!!

Now at admin dashboard Content Pages whenever I click on "Content Pages" item pages the tabs data is showing but here that page's default tab should be active and show the data properly - So, please fix this issue first.

So, please study these frontend pages and make sure that you create proper admin dashboard sections to control all of these pages contents and in the amdin dasboard pages please put placeholder text correctly and make sure that no frontend pages has hardcoded text, images or media(We don't need background colors).

1. Help Center
2. FAQ
3. Store Locations
4. About Us
5. Contact Us

Please create proper seeding all data for all admin dashboard pages so that when I run php artisan migrate:fresh --seed then all admin dashboard pages should have proper seeded data to show in their respective frontend pages properly.

Please study the footer frontend and footer admin dashboard page and there you can notice there are many sections that the admin dashboard is missing to control the frontend footer contents - footer items are not syncing between frontned and admin dashboard - So, please create those missing admin dashboard pages to control the frontend footer contents from admin dashboard properly.

Please study the header navbar frontend page and header admin dashboard page and there you can notice there are many sections that the admin dashboard is missing to control the frontend header navbar contents - So, please create those missing admin dashboard pages to control the frontend header navbar contents from admin dashboard properly.

Please study all frontend pages and then check their respective admin dashboard pages and make sure that all frontend pages content can be managed from admin dashboard properly. If any admin dashboard page is missing to manage any frontend page content then please create those missing admin dashboard pages!!!

And again, check it twice Please study the whole project frontend and dashboard pages and then please create all ramaining admin dashboard sections to control all from pages contents - make sure that all pages should be fully manageable from the admin dashboard. As I need to deliver this CMS project to client and tell much work is stll needed

- As the screenshot of admin dashboard sidebar I provided you that you can notice that the border of when the sidebar items are collapsed are must be smaller but properly and in the admin dashboard sidebar footer logo should be a avatar even in expaned sidebar state and it should show dropdown of account and notification page as before - So, please fix those issues first.
- At frontend order-confirmation slug page the furniture image is not showing properly so please fix it

- As the screenshot I provided you for admin dashbaord sidebar that when the sidebar is collapsed then the border shoudl be smaller that will more beautiful 
- The sidebar footer logo is looking bad so please fix that 
- And when I click on any sidebar menu items its reloading the whole page so please use inertia link for sidebar menu items properly so that the website is SPA like and fast and don't reload the whole page on navigation + 
- And when the sidebar is collapsed and I am clicking on any sidebar menu items the sidebar is expanding and collapsing again and looking bad so please fix that issue!

- As the screenshot I provided you of frontend footer please make sure that you put visa, mastercard and bkash, nagad and rocket payment gateway icons in the footer payment methods section properly.

- And I can't control the currnet frontend header navbar and footer from admin dashboard as there are so many functionalities missing in the admin dashboard - So, please create those missing admin dashboard pages to control the frontend header navbar and footer contents from admin dashboard properly.

- First in admin dashbaord sidebar inset siteheader where we show bredcrumbs it should show the icons what we have in the admin sidebar menu for that particular page 

- And in all admin dashboard pages please make sure that you put seeded data from database seeder what we are using in their frontend pages at admin dashboard also use those seeded data correctly and if its image then it will show the seeded image preview and if its text then it will show the seeded text in the input field properly.

So, I have checked all admin pages you haved created so far I found so much issues and missing functionalities - First of all please fix all those issues and missing functionalities first.

- In the admin dashboard sidebar please use shadcn-ui scroll area component to make the sidebar scrollable so that if there are many menu items in the sidebar then admin can scroll the sidebar to see all menu items properly. And if I scroll to the bottom of the sidebar and then click on any menu item then after page load the sidebar should keep the scroll position properly so that admin don't have to scroll again to find the menu item he clicked before. And we are using react innertia so please use inertia link for sidebar menu items properly so that the website is SPA like and fast and don't reload the whole page on navigation.

- And as the sidebar has so many items so when its collapsed the icons are not visible properly so please make sure to put border around the sidebar items catergory and if a catergory has has mnay items then make sure sure to replace all icons with more icons like ellipsis icon or three dots icon so that its clear to the admin that there are more items in that category. And also make sure to use shadcn-ui tooltip component to show the menu item name when I hover over the menu item icon in collapsed sidebar mode. When we click on that more icon or ellipsis icon then it will expand to show all menu items in that category properly.

- As all admin dashboard pages has seeded data so please make sure that admin dashboard also use those seeded data correctly and if its image then it will show the seeded image preview and if its text then it will show the seeded text in the input field properly.

- Previously we were using shadcn-ui cards components to use py-6 by default but in this project we ues more cards where we put images in the card top so there we have to use pt-0 for those cards so please make sure to use shadcn-ui card components properly with correct padding for cards with image and cards without image. Or make a custom card component that will handle both types of cards properly. And then use that custom card component in all admin dashboard pages and all frontend pages properly. Its like a cards that don't have image should have py-6 and cards that have image should have pt-0.

Thanks to your help we are almost done with this project but still we need to integrate payment gateway - the supported payment gateways are bkash, nagad and rocket and credit cards (Make the credit card details ui with shadcn-ui and zustand and react-hook-form and use zod and typescript properly) And make sure that payment logic is correct as we don't want our users to loose money!!! - these are local online payment gateways in Bangladesh. So, please first install those packages and then integrate those payment gateways into the project properly. With card payment too - We already have user cart and checkout with user auth system so please integrate those payment gateways into the existing checkout system properly. And make sure that when user makes payment successfully then the order is created properly and user get order confirmation message/email properly. And create an admin dashboard page to see all orders with order details page too. And order progress status update functionality from admin dashboard too. Please use shadcn-ui components with free nodejs email sender package and other package to make this system work properly. I like using package that don't require any token or api keys so please use such packages if possible.

So, please study this laravel react inertia codebase - there are so many frotnend pages like About, Contact, Help Center, Store locator and others but in admin panel we can barely control 1 landing page and some products - This is a CMS like project where we have to make all page's text, image, video (Not background colors and other  things) all dynamic. So that admin can control all the content of the frontend pages from admin dashboard. As I mentioned that are like more than 10 frontend pages but in admin dashboard we can control only 1 landing page and some products - So, please first study the codebase properly - and then create all the missing admin pages to control all the frontend pages content from admin dashboard.

I gave you app-sidebar.tsx file where you can learn currnet admin pages - Then I gave you site-footer.tsx and site-header.tsx file where you can get all frontend pages list - So, please first study those files properly to get the full list of frontend pages - And make sure that there shouldn't be any hardcoded text, image or video in any frontend pages - All text, image and video content should be dynamic and manageable from admin dashboard. In some pages sections that can grow so please make those sections dynamic with add more functionality from admin dashboard.

And study the frontend homepage and create all admin dashboard pages to manage the content of those frontend pages from admin dashboard. And in the frontend homepage please create 3 more sections for our "Featured Products", "Best Sellers" and "Customer Reviews" sections just like the "New Arrivals" section is there. Make sure to use shadcn-ui components with shadcn-ui design system - And then create respective admin dashboard pages to manage the content of those frontend sections from admin dashboard.

And in all admin dashboard pages when I click on "Save" or "Update" button its showing that it changed that but when I refresh the page the data is not changing so please fix this issue first. And in all admin dashboard pages please make sure to use shadcn-ui components properly with tailwindcss utility classes. And make sure to create responsive design that works perfectly on all devices. PLease create all admin page for controlling all frontend pages content from admin dashboard. And make sure to use typescript properly with all types defined correctly. And make sure to use inertia link and routing so that the website is SPA like and fast. And make sure to use motion for page transition and other animation effects. And make sure to use zod with react-hook-form for form validation properly. And make sure to follow all best professional coding practices with proper folder structure and clean code.

In the frontend footer page you mentioned so many pages but you didn't created any of those pages so please create those pages first in the frontend with dummy data and then create respective admin dashboard pages to manage the content of those frontend pages from admin dashboard.

Many admin dashobard pages don't show input placeholder text so please make sure to add placeholder text to all input fields in all admin dashboard pages.

In all admin dashboard pages I am getting these errors when I click on submit button of any form:
```All Inertia requests must receive a valid Inertia response, however a plain JSON response was received.
{"message":"Settings updated successfully"}```
So please fix this issue first.
And in admin dashboard "Hero Slides", "Feature Cards" and "Trusted Companies" pages is giving these errors:
```console
index.tsx:122 Uncaught TypeError: Cannot read properties of undefined (reading 'length')
    at FeaturesIndex (index.tsx:122:8)
```

Make sure that from /login page no admin can login as admin has to use the /admin/login page to login as admin user. So, correctly separate the normal user auth and admin user auth system properly.

As you can see thea admin dashboard sidebar from the screenshot I provided you - so please make sure cotents sections items look good and please move the Header and Footer from sidebar footer to sidebar content like other content in the sidebar and also they should collapse with the sidebar icon too!!! And currenlty when do collapse the sidebar its looking bad the logo and other things are looking bad as the second screenshot I provided you so please make sure to fix that issue as well.

Most important thing is that the project name "Furniture" so please fix all the places you used wrong name "FurniCraft" please the real name and make Header control frontend header navbar or "site-header.tsx" and make it dyniamic so that I can control the site-header contents from admin Header page!!!

Currnetly the admin page is not showing collapsible icons so please use shadcn-ui collapible icon sidebar and the current sidebar-inset header is not updating as the page changes so please make sure that the sidebar-inset header changes from "Documents" to the actualy admin page route + remove the quick links sections from sidebar and move "Header" and "Footer" from sidebar footer to sidebar content like other content in the sidebar and also they should collapse with the sidebar icon too!!!

There are many frontend pages that you just listed in the frontend like user profile page, furniture listing page, furniture details page, cart page, checkout page etc but didn't created any any of those pages so please create those pages first in the frontend with dummy data and then create respective admin dashboard pages to manage the content of those frontend pages from admin dashboard. And make sure to use shadcn-ui components properly with tailwindcss utility classes. And make sure to create responsive design that works perfectly on all devices. PLease create all admin page for controlling all frontend pages content from admin dashboard. And make sure to use typescript properly with all types defined correctly. And make sure to use inertia link and routing so that the website is SPA like and fast. And make sure to use motion for page transition and other animation effects. And make sure to use zod with react-hook-form for form validation properly. And make sure to follow all best professional coding practices with proper folder structure and clean code.

Now for this project we have two type of authentication - one is for normal users and another is for admin users. Normal users can only view the furniture items while admin users can manage the inventory. And in the frontend please create profile page for normal users where they can see their profile details and update them. And for admin users create an admin dashboard where they can manage the furniture inventory and all users. And make sure to protect all the admin routes with auth middleware so that only authenticated admin users can access those routes. And normal users should not be able to access admin routes.

Currently the admin dashboard sidebar is dummy and don't works so please update it to point to real pages and then please create all the admin pages to manage furniture inventory and users. And make sure to use shadcn-ui components properly with tailwindcss utility classes. And make sure to create responsive design that works perfectly on all devices. PLease create all admin page for controlling all frontend pages content from admin dashboard. And make sure to use typescript properly with all types defined correctly. And make sure to use inertia link and routing so that the website is SPA like and fast. And make sure to use motion for page transition and other animation effects. And make sure to use zod with react-hook-form for form validation properly. And make sure to follow all best professional coding practices with proper folder structure and clean code.

This is a laravel react intertia fresh project so first install npm packages like
1. zustand
2. tanstack query
3. motion
4. zod
5. react-hook-form
In this project project and then configure them into the project properly and this project uses shadcn-ui design system with tailwindcss so no matter what you do make you sure to follow shadcn-ui design system and tailwindcss utility classes. And shadcn-ui card is good but for cards with image please make sure to put pt-0 as cards covering the whole card top looks good and use py-6 for other cards without image.

This is a CMS like project where we don't need forgot password, email verification and registration system so please make sure to remove those things from the project's auth system and make sure only login and logout functionality is there for admin user with hardcoded credentials like email: furniture@gmail.com and password: password. Make sure to protect all the routes except login route for admin user only. So, the idea is to just create frontend pages and create respective admin dashobard pages to control the frontend page's content from admin dashboard like text, images, videos but no colors or themes just simple text and media content management from admin dashboard. And then there will be a payment gateway integration but still we have to do it in a way that it don't require user registration or login for making payment just simple guest checkout with name, email, phone number and address details along with payment details. So, please make sure to follow these instructions carefully while working on this project. And there will cards, some local online payment gateways like bkash, nagad and rocket will be used for payment gateway integration. So, please install those packages as well for payment gateway integration.

And I will give you a screenshot of a website you have to create that design and make sure that its content's can be managed from admin dashboard. And in the frontend cache that data correctly using tanstack query with using zustand store so if I change that data from admind dashboard then it will show shadcn-ui sonner tost and then auto refetch the frontend data to show the updated data without reloading the page. And you have to create pages in a way that you follow all best professional coding practices with proper folder structure and clean code. Use inertia link and routing so that the website is SPA like and fast. And make sure to use motion for page transition and other animation effects. And make sure to use zod with react-hook-form for form validation properly. And make sure to use typescript properly with all types defined correctly. And make sure to use shadcn-ui components properly with tailwindcss utility classes. And make sure to create responsive design that works perfectly on all devices.

First you need configure the project properly with all these packages and then create a tasklist based on the screenshot I will provide after that and then complete those tasks step by step systematically. Create the fronten and the admin dashboard pages to manage the content of those frontend pages from admin dashboard. And then I will complete the whole frontend myself and then you can create the admin pages to manage the content of those frontend pages from admin dashboard.

And not only that admin panel footer page is not even showing data from frontend footer correctly so fix that first!!!

Currently the frontend footer is not connected with with admin panel footer settings page so please make sure that the frontend footer content is fully controllable from admin panel footer settings page. So admin can change the footer content from there and it should reflect on the frontend footer. Plus make sure that all image uploads has a preview and when we upload a new image it replaces the old one. And also add toast notifications for success or error using shadcn-ui sonner for all create, update and delete actions in the admin panel.

Good, but still now I have these two issues to fix:
- The header admin panel page is big so first put put save button to all sections seprately and make sure that when work separately for that section only. + Currently there the social media sections don't have input text default values set from the current frontend header content. So please set those default input text values from the current frontend header content so admin can change them from there. And make sure that I can control all the frontend header from there!
- At navigation admin panel page there is a button to seed default but it should auto seed the default navigation data when there is no navigation data found in the database. So please make that change. + There is drag icon so make it draggable to reorder the navigation items or just remove that icon if not possible to make it draggable.

Currently the frontned header is not connected with with admin panel header settings page so please make sure that the frontend header content is fully controllable from admin panel header settings page. So admin can change the header content from there and it should reflect on the frontend header. Plus make sure that all image uploads has a preview and when we upload a new image it replaces the old one. And also add toast notifications for success or error using shadcn-ui sonner for all create, update and delete actions in the admin panel.
