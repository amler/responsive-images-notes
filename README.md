## Overview
Implement a strategy for responsive images. Plan for the fact that whatever you implement will be deprecated.

####Variables:

1. The rendered size (in CSS pixels) of the image on our layout
2. The screen density
3. The dimensions of the variously-sized files at our disposal

####Factors considered:

1. Are legacy browsers an issue? Approaches like picture element and srcset attribute are not widely supported. (Picturefill 2.2.0 polyfill support to IE9)

2. Response time - If not crucial a third-party or back-end solution. 

3. Are there lots of images already on a site that is trying to transition to responsive images? Are there concerns about validation or semantic tags (or rather non-semantic tags)? This will require a back-end solution to route the image requests to something like [Adaptive Images](http://adaptive-images.com/) which detects screen size and automatically creates, caches, and delivers device appropriate re-scaled versions of the page's embeded HTML images without any mark-up changes.

4. Art direction - We will need to enabling art direction for designers as we move towards responsive site. Already saw need with TDOY site.

5. Is there a concern about lack of JavaScript? Any of the front-end solutions will be out of the question, which leaves the back-end or third-party options that rely on UA sniffing.

6. Is there a priority for mobile response times over desktop response times? A library like Source Shuffling may be more appropriate.

7. Is there a need to provide responsive behavior to every aspect of the site, not just images? Mobify.js might work better.

#### Basics
1. [SVGS](http://tympanus.net/codrops/2014/08/19/making-svgs-responsive-with-css/) - *Scalable* Vector Graphics. Wherever possible, avoid the problems of pixel-based images by using vector alternatives.
The primary drawback is a lack of support in IE8 and below but you could always provide a PNG fallback or use a shim such as (Raphaël)[http://raphaeljs.com/] or [svgweb](https://code.google.com/p/svgweb/). The Filament Group project [Grunticon](https://github.com/filamentgroup/grunticon) generates SVG and fallback PNGs along with the CSS - also [Grumpicon](http://grumpicon.com/).
See also: [How to Add Scalable Vector Graphics to Your Web Page](http://www.sitepoint.com/add-svg-to-web-page/). 
Use Webfonts Icons -  work in every browser including IE6+ - icon fonts provide similar performance benefits as CSS sprites used to. Make [accessible](https://icomoon.io/#docs/screenreaders)

2. Use High-Resolution Images When Practical. If the standard image is 200Kb and the high-resolution version is 250Kb, there is negligible benefit using image replacement techniques. Use the better version throughout.

3. Automatic resizing and compression service. For sites that are image heavy, it doesn't make sense to resize & optimize for web. Multiple versions for each breakpoint and if you support retina, you'll have several images. Centralized service that will resize and compress. [Responsive Img](http://responsiveimg.com/) - 2 files, 10kb uncompressed. Call `$("img").responsiveImg(e.

4. Images can be resized to any size with URL parameter. [Sencha](http://www.sencha.com/learn/how-to-use-src-sencha-io/) (Akamai Edge Image Manipulation) ***Make sure you’re providing smart caching and not breaking external caches.**

5. Provide automated output of your image markup: PictureFill preferred method. Centralize the markup so that it will be easier to change in the future.

6. Provide art direction needs - [Resoultion switch use case](http://usecases.responsiveimages.org/#resolution-switching) (PictureFill picture element or Akamai)

7. Replacing JPEG and PNG images with WebP. WebP offers significantly better compression than these legacy formats 

8. Agree to and establish breakpoints for mobile to strip out background images for bandwidth: Suggest removal @ 640px for mobile? 1024px for tablets.
	* Samsung Galaxy note edge: 2560x1600 (524 ppi pixel density)
	* Iphone 6 Plus: 1920 x 1080 (@3x resolution) 

#### PictureFill Solution
[PICTUREFILL](http://scottjehl.github.io/picturefill/) - is developed and maintained by [Filament Group](http://www.filamentgroup.com/lab/picturefill_2_a.html). 3.3kb compressed

Picturefill 2.0 allows use of both srcset and/or picture.

It is currently not widely available on all browsers but it will not be long before it is natively available. Until then, we rely on JavaScript polyfills for the element. If a user were to come across a Picturefill’ed image in an unsupported browser with JavaScript turned off, they would see the image’s alt text. 
https://html.spec.whatwg.org/multipage/embedded-content.html#the-picture-element

Filament's version has to have your site built in a specific way to use it. You must manually change the <img> tags to add a pointer to the alternate resolution image. 
**Browsers like Android 2.3 and IE9 can not see the source elements inside a picture element. For IE, the video tag workaround helps us avoid this problem, but Android will still have no access to source elements. Be sure to provide a srcset attribute on your enclosed img to ensure an image will show in this browser**

The new srcset attribute (of the <img> element) tells the browser that it should load one image on a small low-res screen, and load another in a big, high-res one. However, the browser can still choose to ignore this if the browser knows the network conditions are poor, or the device is running out of battery.

While Picturefill attempts to bring the <picture> element to unsupported browsers, [Imager.js](https://github.com/BBC-News/Imager.js) focuses on downloading only the appropriate images while also keeping an eye out for network speeds.

In contrast, the <picture> element includes mandatory instructions to the browser. It requires the browser to match the current display against the given media query, and if it matches, load this specific image. This is critical in cases where you're using "Art Direction", meaning you want to load an image that actually holds different content when you're on a different size screen. The most common example is using a cropped image in a small screen (with less background around the key subject in the photo

just verify that picture is supported in whatever HTML shiv you choose.


It seems pretty clear that srcset will happen. DPR support in srcset is likely to start showing up very soon. Many expect they’ll add support for viewport width shortly after.
Problems:

```
<img src=”a.jpg” srcset=”b.jpg 400w 2x, b.jpg 800w 1x, c.jpg 600h 2x”>
```
1. Specified dimensions indicate the “max” dimensions (e.g. a screen 400px wide or less, with a DPR of 2x or less), and not a “min” dimension.
2. There is no way to modify the definition to be a “min” dimension, which conflicts with how “mobile first” media queries are written.
3. Repetition of URLs. In this case, b.jpg was created for screens that are 800px wide. This includes both a 400w/2x screen and an 800w/1x screen. Long URLs and multiple permutations can really make the attribute long.
4. Confusing mix of height and width create ambiguity. A 2x device was 400×600, should it load b.jpg or c.jpg? Solve this by getting rid of the h
5. The resolution is always specified in pixels (implied)

Srcset is a recommendation, not a rule. This means a browser can choose to download a 1x image despite being on a 2x display. It may do so to preserve battery life, reduce bandwidth, accelerate the page, and may do so automatically or based on user preferences.... **This, in turn, means srcset cannot be used for Art Direction**

The most common use-case for Art Direction is cropping – only showing a portion of an image on a smaller screen. Cropping can be achieved by serving a different image, but it can also be achieved with CSS overlays, showing only a portion of the downloaded image aka wasted bytes. For the use-case of showing different images in different viewports, you would need to stick to JavaScript or CSS.



Responsive Images

Picturefill 2.0 adds support for both the picture element and also new responsive attributes to the img element. Built and maintained by the filament Group

Ensure that images scale efficiently with srcset and sizes.
Art direct images with picture and source media.
Supply an alternate image format using picture and source type.
img with srcset & sizes - notes

The new srcset attribute tells the browser that it should load one image on a small low-res screen, and load another in a big, high-res one. However, the browser can still choose to ignore this suggestion. If the browser knows the network conditions are poor, or the device is running out of battery, it may choose to download a low resolution image even to an HD Tablet.

The sizes syntax is used to define the size of the image across a number of breakpoints. srcset then defines an array of images and their inherent sizes.

READ: Eric Portis: Srcset and Sizes
"And again let me emphasize that while you can attach 1x/2x resolution descriptors to sources in srcset instead of w descriptors, 1x/2x & w do not mix. Don’t use both in the same srcset. Really.” Eric Portis
for simple, not-art-directed, non-type-switched cases like this, you can and should use a single instance of our old friend,  to mark up your responsive image.

srcwill load in any browser that doesn’t understand srcset & sizes. 
The sizes syntax is used to define the size of the image across a number of breakpoints.
srcset then defines an array of images and their inherent sizes 
sizes="[media query] [length], [media query] [length] ... etc, [default length]" A length can be absolute (e.g. 99px, 16em) or relative (33.3vw. In the language of the spec, a length without a paired media query is a “default length”. If there are no media queries that match, that’ll get used. 
srcset takes a comma-separated list of URLs for the available versions of the image; each image’s width is specified using the w descriptor. while you can attach 1x/2x resolution descriptors to sources in srcset instead of w descriptors, 1x/2x & w do not mix. Don’t use both in the same srcset.




#### Akamai Solution
Leverage tool already in use? - [AKAMAI & RESPONSIVE IMAGES](https://github.com/ResponsiveImagesCG/paris-meetup/raw/master/slides/Akamai-Responsive-Images-Sep-2013.pdf)

Front-end optimization, image converter and adaptive image compression, WebP Delivery.

[Image Converter](http://www.akamai.com/html/technology/image-converter.html) enables dynamically manipulating images. Query string to the URL to instruct the Image Converter Cloudlet which action to take and which parameters to use. Supports Art direction.
![Akamai Image Converter](https://blogs.akamai.com/assets_c/2014/11/Miguel%20Blog%20Post%20Image%201-thumb-550x276-3213.png)

![](https://blogs.akamai.com/Miguel%20Blog%20Image%202.png)

API commands including:

* Downsize – reduce an image's dimensions.
* Resize – scale images to a specific width and height.
* Crop – crop, or cut out, a section of an image based on dimension and axis parameters.
* Change Output Quality – compress JPEG images based on a 1 to 100 scale.
* Change Output Format – change JPEG, PNG, GIF & TIFF images to a specific file type such as JPEG, PNG & GIF.
* Background Color – set the background color for transparent images using HTML or Hex colors.
* Compose Images – place an image in a specific location on top of another image e.g. for watermarking.

```
<img src=“/img/123.jpg?resize=320:100” />
```

**Front-end optimization**: responsive image optimization uses the origin (retina image preferably) as the basis. Rounds up current resolution (incluing DPR) to closest version. Uses JavaScript to load images.

* Injects DNS prefetch tags to supporting browsers
* Optionally loads images on-demand (only when visible)
* Optionally uses a low-quality image placeholder before full image

**Adaptive Image Compression (AIC)** given network conditions serves up various sizes. Small for poor quality

#### Additional Notes

If you serve an image of the same size to all browsers, it can at best do one of two things:

* it can look big and sharp for everyone while being too heavy for many users to download, or
* it can be small and fast and look terrible on large and high-definition screens.

There is a common rule in the vast majority of websites: the heaviest content are the images. Very likely your images account for a good 40% (if not more) When your users surf your website in a desktop device, this could be fine, but when they are using a mobile device, they have:

* A smaller device, so images don't need as much quality as in a 17" screen.
* A less powerful processor, so they render images slower
* Probably worse bandwidth, so it takes more time to download the same amount of information.

You could have an `<img>` with no src attribute, and then add it in with JavaScript – but then you’re fetching the resource until much later, delaying the loading of the page. You may find that your page gets reflowed since your browser won’t know the width and height of the image that the JS will select when laying out the page.

So the only way to beat the preloader is to put all the potential image sources in the HTML and give the browser all the information it needs to make the selection there, too. That’s what the `w` and `x` descriptors in srcset are for, and the sizes attribute.

Backend solutions:
Unreliable due to new UA strings that keep appearing - difficult to upkeep a list. Also, the unreliability of easily-spoofed UA strings.

Server-side solutions - [Adaptive Images](http://adaptive-images.com/) a small JavaScript file and does most of the heavy work in its back-end file. It uses a PHP and nginx configured server. Doesn't rely on any UA sniffing but instead checks for the screen width. Image reduction by techniques such as cropping and rotation - not merely scaling

Server-side (and third party) solutions require resources to process the request before sending the correct image back.

[Imager.js](https://github.com/BBC-News/Imager.js/) - **Build failing!** works by using placeholder elements and replacing them with <img> elements.
Browser support is much better than that of Picturefill at the expense of being a more pragmatic solution than a forward thinking one. [More](http://www.toptal.com/responsive-web/one-size-fits-some-an-examination-of-responsive-image-solutions)

Source Shuffling: it serves the smallest resolution possible by default. Upon detecting that a device has a larger screen, it swaps the image source for a larger image. It feels like more of a hack and less of a full fledged library. This is a great solution for chiefly mobile sites but means double resource downloading for desktops and/or tablets is unavoidable.
http://www.jordanm.co.uk/lab/sourceshuffling

HiSRC - A jQuery plugin for responsive images. Dependency on jQuery might be an issue.
https://github.com/teleject/hisrc

Mobify.js - A more general library for responsive content, including images, stylesheets and even JavaScript. It ‘captures’ the DOM before resource loading. Mobify is a powerful comprehensive library, but may be overkill if the goal is just responsive images.
http://www.mobify.com/mobifyjs/

Media queries for determining which resource to load, whether as part of the picture element or not, there was… some unease from the browser folks. Media queries are more complex to evaluate, and thus would require more CPU;

Image-set - talk about extending it to have w descriptors and have various file formats.

	#test {
        background-image: url(assets/no-image-set.png); 
        background-image: -webkit-image-set(url(assets/test.png) 1x,
               url(assets/test-hires.png) 2x);
        width:200px;
        height:75px;
    }

=============


Define the problem - WHAT IS REPSONSIVE IMAGES?

A: Efficiently loading properly dimensioned images that fit the page's design

Q: “why all this complex new markup? Why not just use CSS or JavaScript?”

A: All browsers have what’s called a preloader. As the browser is munching through the HTML – before it’s even started to construct a DOM – the preloader sees “<img>” and rushes off to fetch the resource before it’s even thought about speculating about considering doing anything about the CSS or JavaScript. So, by the time the browser gets around to dealing with CSS or script, it may very well have already grabbed an image – or at least downloaded a fair bit.
With media queries you’ll find that the preloader has downloaded the resource pointed to by the `<img src>` and then the one that the CSS replaces it with is downloaded, too. So you get a double download which is not what you want at all.



**HISTORY **
For the past 4 years and some change many permutations of images in responsive design.


The need for Responsive Images can be broken down into three use-cases:

1. DPR Switching: Serving higher res images only to devices with higher Device Pixel Ratio. These reasons include the image being used at a different size based on the size of the screen, the pixel density of the screen, or to avoid downloading unnecessarily large images.
2. Viewport Switching: Serving smaller images to smaller or lower-resolution screens
3. Art Direction: Serving a different (often cropped) version of an image to a smaller screen, highlighting the important parts of a picture instead of just shrinking it.

Alternative solutions currently available

1. [Picture](http://picture.responsiveimages.org/): an HTML element similar to HTML5’s `<video>` tag, which uses media-queries to determine which image to load and is uber flexible.
2. [srcset](http://dev.w3.org/html5/srcset/): An `<img>` tag attribute specifying different URLs to load for a given DPR and possibly resolution.
3. [Client Hint](https://github.com/igrigorik/http-client-hints)s: 
HTTP header(s) the browser would send, indicating the client’s DPR (and more), allowing the server to serve the correct image.


Its a performance problem that needed to be solved. Can't tailor websites to each mobile device. RWD - media queries, fluid grids, flexible images to help fit the device on which they are shown.

"Flexible images" not really working - 
Solution to send the browser largest image and let the browser resize it resulting in bloated websites and poor performance. Sites serve the same resources for all devices which are mainly images - causing Data plan abuse and wasting time.

Responsive Images community group was formed as a forum to address this problem. Group settled on the <picture> prosoal from bruce lawson from opera which mimics the video tag. Then on WHATWG Apple proposed <srcset> as a solution which mimics the image set from css.

Aple's proposal was hacked into the html standard without much discussion. Then the picture vs. srcset debate began. Both solve different use cases but they can be combined as a solution. Browser vendors not convinced there is a consensus. 

Picture element revised 

SYNTAX

I . The srcset 'x' part - Mo' pixels mo' problems (1x, 1.5x, 3x)

Srcset solves for retina images. Loading hi resolution images ONLY for hi resolution devices. Lower resolutions devices will only low res, fast loading images. 

Ex. Fix image width - doesn't change dimensions when the viewport is change

syntax:
		
	<img src="1x.jpg" 
		**contains list with descriptor - browser pref/ bandwidth contraints**
		 srcset="2x.jpg 2x, 2.6x.jpg 2.6x" 
		 alt"an alt text.">

II. The picture element
First use case
Main use case is for art direction for adapting the image for different layout breakpoints of the page. cropping swapping portrait vs landscape

syntax:
		
	<picture>
		<source media="(min-width: 45em)"
				srcset="large.jpg">
		<source media="(min-width: 18em)"
				srcset="medium.jpg">
		<img src="small.jpg" alt="alt text">
	<picture>
	
Source children with media attributes. Similar to video - the first one the browser matches will pick the srcset attribute. has to be there or nothing will be displayed. The browser detects the image element then checks the parent and then modifies internally the sources to 

Second use case - MIME type fallback
All the browsers support png, gif, jpg, but different companies pushing different image file formats e.g. webp & jpg xr. If we want to provide the browser with a set of options for the client side, we don't have that option like with fonts or different video formats. Nowadays with the type attribute we can provide the browser with MIME types. The browser is provided with types and picks the one it supports. If we don't have the ability with a server side solution.

syntax:
		
	<picture>
		<source type="image/webp"
				srcset="kitties.webp">
		<source type="image/vnd.ms-photo"
				srcset="kitties.jpx">
		<img src="kitties.jpg" alt="kitties">
	<picture>


III. Sizes and srcset 'w' descriptor - The most complex part

Use case - variable width images. Images that have different dimensions across different viewports. This doesn't mean that narrow viewports have smaller images. Example: Single column layout on a phone will display larger images than a 2 column layout on a tablet. 

syntax:
		
	<img src="puppy.jpg"
		 sizes="100vw" // default size is 100vw so you can omit if this is the use case.
		 srcset="puppy200.jpg 200w,
		 		puppy400.jpg 400w, puppy800.jpg 800w,
		 		puppy1200.jpg 1200w, puppy2400.jpg 2400w"
		 alt="A pretty cute puppy" />

Now describing the images width in pixels giving the browsers with a set of resources for it choose the one it sees fit. The sizes attribute tells the browser what will be the display size of the image will be. Sizes tells the browser needs to start downloading the images before layout has taken place. If we wait for layout, you can expect circular conditions where the images dimensions would impact the layout - a different image could be requested. Declaritive helps tell the browser the dimensions to display the image.

If you have an image more or less a fixed percentage of the view port, you should provide the browser the dimensions the image is displayed. It doesn't have to be accurate - `sizes="44vw"`. Better than pickking an image that's too large wasting bandwith and data.

Sizes can get ... verbose.

	<img src="shark.jpg"
		 sizes="(min-width: 1200px) 235px, // FIXED LENGTH
		 		(min-width: 641px) 24vw,  // PERCENTAGE LENGTH
		 		(min-width: 470px) 235px
		 		50vw"  // DEFAULT - GOES TO 50%
		 srcset="shark100.jpg 100w,
		 		shark200.jpg 200w, shark235.jpg 235w,
		 		shark470.jpg 470w"
		 alt="A kick ass shark" />
 
Display information in marup for performance purposes. Sizes is better than downloading a huge image.

COMBINED for art direction needs:

	<picture>
		<source media="(min-width: 751px)"
				
				sizes="(max-width: 1600px) 100vw,
				1600px"
				
				 srcset="shark750.jpg 750w,
		 				shark200.jpg 200w", 
		 				shark235.jpg 235w"

			<img src="shark.jpg"
				srcset="shark200.jpg 200w,
						"shark450.jpg 450w"
				alt="Dancing sharks">
	<picture>
**Source Order matters on source and sizes!** Narrowest media queries go first 

Clint Hints - not yet in place
Proposal for a server side based solution. The browser sends out DPR of screen and width of the resource to the server and the server does resizing automatically. Developers don't always have permissions/skills for server side logic. Cleaner markup and avoid the large number of resoursces needed.




####Resources
[``<picture> ``](https://html.spec.whatwg.org/multipage/embedded-content.html#embedded-content)

[Picturefill 2.0: Responsive Images And The Perfect Polyfill - Tim Wright](http://www.smashingmagazine.com/2014/05/12/picturefill-2-0-responsive-images-and-the-perfect-polyfill/)

[Srcset and sizes - Eric Portis](http://ericportis.com/posts/2014/srcset-sizes/)

[The new srcset and sizes explained - Martin Wolf](http://martinwolf.org/2014/05/07/the-new-srcset-and-sizes-explained/)

[Responsive Images Done Right: A Guide To <picture> And srcset - Eric Portis](http://www.smashingmagazine.com/2014/05/14/responsive-images-done-right-guide-picture-srcset/)

[#133: Figuring Out Responsive Images](http://css-tricks.com/video-screencasts/133-figuring-responsive-images/)

[To Picturefill, or not to Picturefill - Scott Jehl](http://www.filamentgroup.com/lab/to-picturefill.html)

[18 Image Compressors to Speed Up Your Website - Grace Smith 2013](http://mashable.com/2013/10/29/image-compressors/)

[Responsive Images: Don't use <picture>, use Picture](https://community.akamai.com/thread/1106)

[Don’t use <picture> (most of the time)](http://blog.cloudfour.com/dont-use-picture-most-of-the-time/)

[Reduce the size of the above-the-fold content](https://developers.google.com/speed/docs/insights/PrioritizeVisibleContent#CompressImages)

[The Responsive Web Design journey: the crossroad between devices and image manipulation](https://blogs.akamai.com/2014/11/the-responsive-web-design-journey-the-crossroad-between-devices-and-image-manipulation.html)

[MAKING SVGS RESPONSIVE WITH CSS](http://tympanus.net/codrops/2014/08/19/making-svgs-responsive-with-css/)

[One Size Fits Some: A Guide to Responsive Design Image Solutions](http://www.toptal.com/responsive-web/one-size-fits-some-an-examination-of-responsive-image-solutions)
[Responsive Images Meetup – A Subjective Summary](http://www.guypo.com/responsive-images-meetup-a-subjective-summary/)

[Native Responsive Images](https://dev.opera.com/articles/native-responsive-images/)

[SIZER SOZE - WHAT IS THE COST OF YOUR NON-RESPONSIVE IMAGES?](http://www.sizersoze.org/)

*<http://www.akamai.com/html/technology/image-converter.html>
*<http://blog.cloudfour.com/css-media-query-for-mobile-is-fools-gold/>

*<http://alistapart.com/article/responsive-images-in-practice>
