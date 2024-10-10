# Changelog

- 9/10: Clarify section 2.5.1 - Viewing a profile.

# Assessment 3 (HTML, CSS, Vanilla JS)

[Please see course website for full spec](https://cgi.cse.unsw.edu.au/~cs6080/NOW/assessments/assignments/ass3)

This assignment is due *Friday 25th October, 8pm*.

Please run `./util/setup.sh` in your terminal before you begin. This will set up some checks in relation to the "Git Commit Requirements".

## 2. Your Task - Qanda 

In this assignment you are working on the frontend.

Your task is to build a frontend for a UNSW rip-off version of the popular forum [EdStem](https://edstem.org). You will of course be familiar with this application - it is the forum we use for this course!

UNSW's rip-off of Qanda is called "Qanda". However, you don't have to build the entire application. You only have to build the frontend. The backend is already built for you as an express server built in NodeJS (see spec).

Instead of providing visuals of what the frontend (your task) should look like, we instead are providing you with a number of clear and short requirements about expected features and behaviours.

The requirements describe a series of **screens**. Screens can be popups/modals, or entire pages. The use of that language is so that you can choose how you want it to be displayed. A screen is essentially a certain state of your web-based application.

### 2.1. Milestone 1 - Registration & Login (10%)

Milestone 1 focuses on the basic user interface to register and log in to the site.

#### 2.1.1. Login
 * When the user isn't logged in, the site shall present a login form that contains:
   * an email field (text)
   * a password field (password)
   * submit button to login
 * When the submit button is pressed, the form data should be sent to `POST /auth/login` to verify the credentials. If there is an error during login an appropriate error should appear on the screen.

#### 2.1.2. Registration
 * When the user isn't logged in, the login form shall provide a link/button that opens the register form. The register form will contain:
   * an email field (text)
   * a name field (text)
   * a password field (password)
   * a confirm password field (password) - not passed to the backend, but an error should be shown on submit if it doesn't match the other password
   * submit button to register
 * When the submit button is pressed, if the two passwords don't match the user should receive an error popup. If they do match, the form data should be sent to `POST /auth/register` to verify the credentials. If there is an error during registration an appropriate error should appear on the screen.

#### 2.1.3. Error Popup
 * Whenever the frontend or backend produces an error, there shall be an error popup on the screen with a message (either a message derived from the backend error response, or one meaningfully created on the frontend).
 * This popup can be closed/removed/deleted by pressing an "x" or "close" button.

#### 2.1.4. Dashboard
 * Once a user has registered or logged in, they should arrive on the dashboard.
 * For now, the dashboard will be a blank screen that contains only a "logout" button visible at all times.
 * When this logout button is pressed, it removes the token from the state of the website (e.g. local storage) and then sends the user back to the login screen.

### 2.2. Milestone 2 - Making Threads (15%)

Milestone 2 focuses on how to make a thread and then view that thread (along with others).

#### 2.2.1. Making a thread

> **What is a fold?**<br>
> Above the fold content is the part of a web page shown before scrolling. Any content you'd need to scroll down to see, would be considered 'below the fold'. The 'fold' is where the browser window ends, but the content continues underneath ([source](https://www.optimizely.com/optimization-glossary/above-the-fold)).

* Somewhere above the fold, on every page, there should be a button that says "Create" that takes you to a new screen.
  * This new screen should occupy the entire page excluding any header or footers
  * On this screen contains an input field for title, content, and whether or not the thread is private
  * This screen should also contain some form of submit button
* The submit button creates a new thread via `POST /thread`, and once the request returns successfully, returns a user to an new screen that shows that thread (2.2.3)

#### 2.2.2. Getting a list of threads

* When you are on the dashboard, a list of threads should appear (with `GET /threads`) on the left hand side of the page
  * The width of this list should be no more than `400px`.
* It contains a list of threads where each thread is captured in a box no taller than `100px`.
  * Each box should contain the thread title, the post date, the author, and the number of likes.
* Because the API of `GET /threads` returns 5 elements at a time, you don't need to display the full list one at a time. Section `2.6.1` covers how you can get some extra marks for doing this with an infinite scroll, but for `2.2.2` to get the marks all you need to do is have a `more` button that each time it's clicked, it shows the next 5 elemetns until no more items are left, then the button disappears.

#### 2.2.3. Individual thread screen

* When a particular thread is clicked on in the side bar, or after a thread is created, you are taken to an "individual thread screen".
* This individual thread screen should include the list of threads on the left (`2.2.2`) but the main page body content should contain information on threads that includes:
  * Title
  * Body content
  * Number of likes
* This page will later on include things like edit, delete, like, watch, comments etc, but you can skip this for `2.2.3`.

### 2.3. Milestone 3 - Thread Interactions (10%)

Milestone 3 focuses on how to interact with threads once they've been made

#### 2.3.1. Editing a thread

* On an individual thread screen, the user should see a "edit" button somewhere above the fold that allows them to edit the thread (e.g. by new page or modal).
* On this screen contains an input field for title, content,  whether or not the thread is private, and whether or not a thread is locked. These fields are pre-populated based on the current thread data.
* This screen should also contain some form of save button
* When the save button is pressed, `PUT /thread` is called which updates the details, and when that request returns, the user is taken back to the individual thread page.
* The edit button only appears if the user is an admin or a creator of that thread.

#### 2.3.2. Deleting a thread

* On an individual thread screen, the user should see a "delete" button somewhere above the fold that allows them to delete the thread via `DELETE /thread`.
* The delete button only appears if the user is an admin or a creator of that thread.
* Once the thread delete request is returned, the screen should redirect to the latest individual thread post from the thread list.

#### 2.3.3. Liking a thread

* On an individual thread screen, the user should see a "like" action (button, icon) somewhere above the fold that allows them to like or unlike a thread via `PUT /thread/like`.
* If the thread is currently liked by this user, the button should imply visually that clicking it will unlike the thread. If the thread is currently not liked by this user, the button should visually imply clicking it will cause it to be liked.
* Any liking or unliking should reflect a change in the UI immediately.
* Locked threads cannot be liked.

#### 2.3.4. Watching a thread

* On an individual thread screen, the user should see a "watch" action (button or icon) somewhere above the fold that allows them to watch or unwatch a thread via `PUT /thread/watch`.
* If the thread is currently watched by this user, the button should imply visually that clicking it will unwatch the thread. If the thread is currently not watched by this user, the button should visually imply clicking it will cause it to be watched.
* Any watching or unwatching should reflect a change in the UI immediately.

### 2.4. Milestone 4 - Comments (15%)

Milestone 4 focuses on commenting features once the threads have been made.

#### 2.4.1. Showing comments

* When an individual thread screen loads, it should load all of the relevant comments from `GET /comments` that apply to that particular thread.
* These comments should be displayed as list on the page, where each comment shows:
  * The comment text
  * A profile picture for that user that commented
  * The time since commented in the format either
    * "Just now" if posted less than a minute ago, or
    * "[time] [denomination](s) ago" if posted more than a minute ago, e.g. "1 minute(s) ago" "7 hour(s) ago". You move from 1-59 minutes, then 1-23 hours, then 1-6 days, then 1-N weeks where N can be a number of unlimited size.
    * The number of people who have liked the comment.
* Some comments have a parent that is another comment. These comments need to be nested under their parent comment. For each layer of nesting, there needs to be some kind of visual indentation.
* Comments must be sorted in reverse chronological order (most recent comments at the top of the page). Nested comments should be sorted within their nested area.

#### 2.4.2. Making a comment

* If there is no comments on the thread, an input/textarea box should appear below the thread information.
  * Underneath this box, a "Comment" button should exist
  * When the comment button is pressed, the text inside the text comment should be posted as a new comment for the thread at `POST /comment`.
  * If there are comments on the thread, an input/textarea box should appear but at the bottom of the comments instead.
* Each comment should have a "reply" text/button somewhere in the space that contains the comment info.
  * When this reply text/button is pressed, a modal should appear that contains an input/textarea box and a "comment" button.
  * When the comment button is pressed, the text inside the text comment should be posted as a new comment for the thread at `POST /comment` and the modal should disappear.
* Locked threads cannot have a new comment added to them.

#### 2.4.3. Editing a comment

* Each comment should have an "edit" text/button somewhere in the space that contains the comment info.
* When this edit text/button is pressed, a modal should appear that contains an input/textarea box and "comment" button.
* The input/textarea box should contain the current comment text.
* When the comment button is pressed, the text inside the text comment should be posted as the updated comment for the thread at `PUT /comment` and the modal should disappear.
* To be able to edit a comment, the user has to be either the creator of the comment or an admin of the forum.

#### 2.4.4. Liking a comment

* Each comment should have a "like" text/button somewhere in the space that contains the comment info.
* If the comment is already liked, the text/button should say "unlike".
* When the "like" text/button is pressed, the comment moves into a liked state via `PUT /comment/like`. After this change, the liked counter should change.
* When the "unlike" text/button is pressed, the comment moves into a not-liked state via `PUT /comment/like`. After this change, the liked counter should change.

### 2.5. Milestone 5 - Handling Users (10%)

Milestone 5 focuses predominately on user profiles and admins manage other admin permissions.

#### 2.5.1. Viewing a profile

* Let a user click on a user's name from a thread or comment, and be taken to a profile screen for that user.
* The profile screen should contain any information the backend provides for that particular user ID via (`GET /user`) (excludes the user ID).
* The profile should also display all threads made by that person. The threads shown should show the title, content, number of likes and number of comments.

#### 2.5.2. Viewing your own profile
* Users can view their own profile as if they would any other user's profile.
* A link to the users profile (via text or small icon) should be visible somewhere common on most screens (at the very least on the feed screen) when logged in.

#### 2.5.3. Updating your profile
* Users can update their own personal profile via (`PUT /user`). This allows them to update their:
  * Email address
  * Password
  * Name
  * Image (has to be uploaded as a file from your system)

#### 2.5.4. Updating someone as admin

* If the user (with admin privilege) viewing another user's profile screen, they should be able to see a dropdown that includes options "User" and "Admin".
* The option selected in the dropdown by default on the page should reflect the user's current admin status.
* Underneath the drop down, an "Update" button should exist, that when clicked, updates the user to that permission level.

### 2.6. Milestone 6 - Challenge Components (`advanced`) (5%)

#### 2.6.1. Infinite Scroll 
* Instead of pagination, use an infinitely scroll through a thread. For infinite scroll to be properly implemented you need to progressively load threads as you scroll. 

#### 2.6.2. Live Update
* If another user likes a thread or comments on a thread that the user is viewing, the thread's likes and comments should update without requiring a page reload/refresh. This should be done with some kind of polling.

*Polling is very inefficient for browsers, but can often be used as it simplifies the technical needs on the server.*

#### 2.6.3. Push Notifications
* Users can receive push notifications when a new comment is posted on a thread they watch. 
* To know whether a new comment has been posted to a thread, you must "poll" the server (i.e. intermittent requests, maybe every second, that check the state). 
* You can implement this either via browser's built in notification APIs or through your own custom built notifications/popups. The notifications are not required to exist outside of the webpage.

_No course assistance in lectures will be provided for this component, you should do your own research as to how to implement this. There are extensive resources online._

### 2.7. Milestone 7 - Very Challenge Components (`advanced *= 2`) (5%)

#### 2.7.1. Static feed offline access
* Users can access the most recent feed they've loaded even without an internet connection.
* Cache information from the latest feed in local storage in case of outages.
* When the user tries to interact with the website at all in offline mode (e.g. comment, like) they should receive errors

_No course assistance will be provided for this component, you should do your own research as to how to implement this._

#### 2.7.2 Fragment based URL routing
Users can access different pages using URL fragments:
```
* `/#thread={threadId}` to access the individual thread screen of that particular `threadId`
* `/#profile` to view the authorised user's own profile
* `/#profile={userId}` to view the profile of the user with the particular `userId`
```

_No course assistance in lectures or on the forum will be provided for this component, you should do your own research as to how to implement this._
