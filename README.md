## Image Upload

  - Create cloudinary account
  - Activate account from email (very important!)
  - Install cloudinary and multer
    `npm i -S cloudinary multer`
  - Configure multer for upload in routes file (add image filter?)
    - add middleware -> upload.array('nameAttr', maxNum)
  - Update new view form element with enctype='multipart/form-data'
  - Add input to form -> attrs: type='file', name='images', accept='images/', multiple
  - require cloudinary in controller
  - Configure cloudinary (put api_secret in .env)
  - add for...of loop with cloudinary upload
  - Update Post mode, imamges field to [{url: String, public_id: String}]
  - Test it out!

## Posts Edit Form
  - update checkbox name
  - add enctype to form

## Posts Update Route
  - add upload.array()

## Posts Update Method
  - find the post by id
  - check if there's any images for deletion
    - assign deleteImages from req.body to its own variable
    - loop over deleteImages
      - delete images from cloudinary
      - delete image from post.images
  - check if there are any new images for upload
    - upload images
      - add images to post.images array
  - update the post with new any new properties
  - save the updated post into the db
  - redirect to show page

# Geocoding Post Address and Adding It's Marker to the Map

## Update Post Model
  - Remove lat and lng and add coordinates: Array

## Update Posts Controller
  - Add the geocodingClient to top of file:
  ```
  const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
  const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
  ```
## Update create (POST) method
  ```
  let response = await geocodingClient
  .forwardGeocode({
    query: req.body.post.location,
    limit: 1
  })
  .send();
  ```
  - Assign the respons's coordinates to req.body.post.coordinates
  - Save the post

## Update the Posts Show View
  - Remove geojson object
  - Remove forEach loop over geoson.features
  - Assign post variable from EJS local variable
  - Update marker to use post instead

## Adding Flash Messages
  - Update pre-route middleware to check for error or success on the session
  - Update post-route error handling middleware to console.log() the full err, then set err.message on req.session.error and redirect('back')
  - Create a partial for flash messages and include it in our layouts
  - Write some success messages and throw some errors to test it out

## Edit Reviews
  - Add style.css to post-show-layout
  - Remove body rule from post-show.css
  - Add toggle edit button to post show view
  - Add edit form to the post show view
  - Add edit-form rule to post-show.css
  - Add jQuery to post-show-layout
  - Add click event listener script to post show view
    - Toggle text cancel/edit
    - Toggle edit-form visibility

## Review Authorization
  - Create a second user with cURL
  - Change existing review's author to new user's id
  - Add isReviewAuthor async middleware to PUT route and test it
  - Add if statement to EJS

## Review Delete
  - Create a delete button with a form in the post show view
  - Update the delete route with isReviewAuthor middleware and reviewDestroy method
  - In reviewDestroy method:
    - Find post by id and update to pull reviews with matching review_id
    - Find review by id and remove
    - Flash Success
    - Redirect to back to post show

## Restrict One Review Per User, Per Post
  - Populate reviews on post in reviewCreate method (in reviews controller)
  - Filter post.reviews by author to see if logged in user has already reviewed the post
  - Assign hasReviewed to filtered array's length
  - If hasReviewed is true, then flash error and redirect
  - Otherwise, create review, add to post.reviews, save post, flash success, and redirect

## Remove Referenced Reviews When a Post Gets Deleted
  - Add pre('remove') hook/middleware to Post Model
  - Add success flash message to posts controller postDestroy method

## Add 5 Star Rating Feature
  - Add starability-basic.min.css to /public/stylesheets from [here](https://raw.githubusercontent.com/LunarLogic/starability/master/starability-minified/starability-basic.min.css)
  	- Review [documentation](https://github.com/LunarLogic/starability) as needed
  - Add link to starability-basic.min.css in post-show-layout.ejs
  - Add starability syntax to review new and edit forms in post show.ejs
  - Customize id's and names
  - Add client script inside of .forEach loop for reviews to auto check rating in edit form

## Add Clear Rating Button to 5 Star Rating Feature
  - Add a button to the new/edit review forms:
  ```HTML
  <button class="clear-rating" type="button">Clear Rating</button>
  ```
  - Add styling to /public/stylesheets/post-show.css
  ```CSS
  .clear-rating {
    display: block;
  }
  ```
  - Add click listener to the clear rating button in /public/javascripts/post-show.js (selects and clicks nearest zero star rating input):
  ```JS
  // Add click listener for clearing of rating from edit/create form
  $('.clear-rating').click(function() {
    $(this).siblings('.input-no-rate').click();
  })
  ```

#Add Pagination to Posts Index
  - Seed some post data
    - Install faker npm i -S faker
    - Create a seeds.js file in the root directory /surf-shop and open it
    - Require faker const faker = require('faker');
    - Require Post model const Post = require('./models/post');
    - Write an async function that removes existing posts and runs a loop that generates 40 posts
```JS
 async function seedPosts() {
 	await Post.remove({});
 	for(const i of new Array(40)) {
 			const post = {		
 				title: faker.lorem.word(),
 				description: faker.lorem.text(),
 				author: {
 			    "_id" : "5bb27cd1f986d278582aa58c",
 			    "username" : "ian"
 				}
 			}
 			await Post.create(post);
 	}
 	console.log('40 new posts created');
 }
```
    - Export the function module.exports = seedPosts;
    - Require the seedPosts function and invoke it in app.js
```JS
 const seedPosts = require('./seeds');
 seedPosts();
```
  - Install mongoose-paginate npm i -S mongoose-paginate
  - Add mongoose-paginate to Post model
```JS
 const mongoosePaginate = require('mongoose-paginate');
 ...
 PostSchema.plugin(mongoosePaginate);
```
  - Update postIndex method in /controllers/posts.js to include pagination in query
```JS
 // Posts Index
 async postIndex(req, res, next) {
 	let posts = await Post.paginate({}, {
 		page: req.query.page || 1,
 		limit: 10
 	});
 	posts.page = Number(posts.page);
 	res.render('posts/index', { posts, title: 'Posts Index' });
 },
```
  - Update loop over posts in /views/posts/index.ejs so that it loops over posts.docs now
```HTML
 <% posts.docs.forEach(function(post) { %>
```
  - Create a paginatePosts.ejs partial in /views/partials
```HTML
 <div style="margin: 20px 0">
 <% if(posts.page - 1) { %>
 	<a href="/posts?page=<%= posts.page - 1 %>">Prev</a>
 <% } %>
 <% for(let i = 1; i <= posts.pages; i++) { %>
 	<a href="/posts?page=<%= i %>" <%= i === posts.page ? 'style=color:#000' : '' %>><%= i %></a>
 <% } %>
 <% if((posts.page + 1) <= posts.pages) { %>
 	<a href="/posts?page=<%= posts.page + 1 %>">Next</a>
 <% } %>
 </div>
```
  - Include the partial in your /views/posts/index.ejs view (I include it twice, once above the posts loop and once below) <% include ../partials/paginatePosts %>

## Add average rating to Post

  - Add an extra user to the db so we have three to make reviews with (run in terminal with server running separately)

  `curl -d "username=john2&password=password" -X POST http://localhost:3000/register`

  - Add avgRating property to PostSchema (/models/post.js)
  ```JS
  const postSchema = new Schema({
    title: String,
    price: String,
    description: String,
    images: [ {url: String, public_id: String} ],
    location: String,
    coordinates: Array,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    avgRating: { type: Number, default: 0}
  });
  ```

  - Add Review Model
