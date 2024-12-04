Reflection

What have I achieved?

I successfully completed all the requirements for this project.
Users can sign up to the site using Clerk, and during sign-up, they are required to set a villain name (username). I implemented webhooks so that when a user signs up, the webhook retrieves their data and sends it to Supabase.
On the Villains page, users can view all the villains and click on their names to view their profiles. At the top of the page, there is a search function that allows users to search for villains. If a villain exists, the search takes the user directly to their profile; if the villain does not exist, an error page is displayed.
On the profile page, users can delete their posts. I used the Alert Dialog component from Radix to ensure users confirm their intention before a post is deleted. I also made it possible to create and update the user’s backstory (bio).
Users can create posts on the Deed Log page, which are then displayed on the same page. Posts are also visible on the user’s profile page and can be viewed when visiting other users' profiles.

Additionally, I explored using localization to customise the wording of the Clerk components. I was able to replace the word "username" with "villain name" during sign-up, sign-in, and within profile details. I really like this feature and look forward to experimenting with it further in the future.

What remains to be done?
I still haven’t implemented the "like" feature (evil laughs). Moving forward, I want to make it possible to click on a user’s name when viewing a deed, taking the viewer to that user’s profile. I also plan to add buttons to the profile page that will trigger pop-up forms for updating backstories and posting deeds.

Unfortunately, I haven’t had time to experiment with adding the notoriety score. As a result, there’s still no leaderboard or ranking system. I ran into issues with an SQL query; it worked when I removed the join with the levels table, but this means titles are not being displayed. I hope to fix this in the future.

Challenges and solutions:
To achieve my goals for this assignment, it was essential to insert user data into the database when users signed up. Early on, I discovered that I needed to use webhooks to achieve this, so I turned to Clerk’s documentation. I encountered significant challenges here. To test webhooks locally, the documentation suggested setting up Ngrok, but I couldn’t install it because my student laptop requires administrator permission to download software. 
I tried using Inngest and managed to get part of it working, but it didn’t function fully, so I eventually had to abandon it. Fortunately, I discovered LocalTunnel, which allowed me to execute the necessary package without requiring any installations. Using LocalTunnel, I exposed my site to the world and successfully configured the webhook.
The next step was to retrieve the information and insert it into Supabase. My first attempt returned a failed webhook message. After several hours of troubleshooting, I realized that the LocalTunnel link had expired between the time of the first successful webhook test and my first attempt to insert data into Supabase. After fixing the link and making a few additional tweaks, I successfully got the data into Supabase.

I encountered many challenges during this assignment, but webhooks were by far the biggest hurdle. After a few cries… I mean, tries, I managed to overcome them and accomplish my goal.

Some useful resources:
https://clerk.com/docs/customization/localization
https://github.com/clerk/javascript/blob/main/packages/localizations/src/en-US.ts
https://clerk.com/docs/webhooks/sync-data
https://docs.svix.com/receiving/verifying-payloads/how
