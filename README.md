Responsive Images: PictureFill Practice
<!-- 

This toolset allows for both new and on-going development work. Please open any issues on the tool against [the wpa repo](http://10.7.145.254/ally/wpa).

## Requirements

Node.js installed from our [locally managed version repo](http://10.7.145.254/ally/node-versions). Use the latest version from the referenced repo.

## Installation

1. Install node.js
1. Make sure you have Compass and Sass in your path:
  * `sudo gem install sass`
  * `sudo gem install compass`
1. Run `sudo npm install -g grunt-cli`
  1. Try without `sudo` first if you'd like.
1. `cd` to your project directory in Terminal and run `npm install`
1. Run `grunt build` to generate the initial public directory.

## Using CodeKit

You can use CodeKit to watch your Sass files. There is a Compass configuration file already in this repo.  There are a couple things you'll need to configure in Compass to make it work:

1. Open CodeKit and go to the Preferences screen `CMD+,`. At the bottom of the general panel there is a "Skipped items" area. Make sure the following four folder names are in the list:
  1. log
  1. node_modules
  1. tasks
  1. api
1. Now you can add the project to CodeKit normally. You shouldn't have to worry about setting the compile point as the Compass config will take care of that for you.

Now that you're setup, to use CodeKit simply call `grunt local` or `grunt preview` with a `--disable-sass` flag.

**\* Note:** In the light testing done, it doesn't appear to have dramatic speed gains over the standard watcher in the toolset with `grunt local` or `grunt preview`. -->