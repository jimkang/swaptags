swaptags
========

A small script for swapping &lt;script&gt; tags out of an html file and replacing them with the production versions.

To use:
-------

  1. Set up a json file that contains the tags that it should replace as the keys and the values it should replace them with. For example:
         {
            "<!-- tagsfordev -->":  
              "
                <script src=\"underscore-min.js\"></script>
                <script src=\"d3.v3.min.js\"></script>
                <script src=\"sprigotclient.js\"></script>
              "
          }
  It's OK to have line breaks in the JSON values for now, as it will clean them out before parsing. (In the future, swaptags might use a format that's friendlier to line breaks.) The tag can be any string, but html comments work well in html files.

  2. Use those tags in the source html file to mark off what you want replace. Example:
         
        <!DOCTYPE html>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

        <html>
        <head>
          <title>Sprigot</title>
          <link rel="stylesheet" type="text/css" href="sprig.css" />
        </head>

        <body>

          <!-- tagsfordev -->
          <script src="lib/underscore.js"></script>
          <script src="lib/d3.v3.js"></script>
          <script src="camera.js"></script>
          <script src="sprig-d3_relations.js"></script>
          <script src="caseData.js"></script>
          <script src="uid.js"></script>
          <script src="network.js"></script>
          <script src="okcanceldialog.js"></script>
          <script src="store.js"></script>
          <script src="treerenderer.js"></script>
          <script src="treenav.js"></script>
          <script src="graph.js"></script>
          <script src="textstuff.js"></script>
          <script src="divider.js"></script>
          <script src="historian.js"></script>
          <script src="sprigot.js"></script>
          <script src="direct.js"></script>
          <!-- tagsfordev -->

        </body>
        </html>

  3. Run the script like so:
  
         node swaptags.js index.html prodreplacements.json dist/index.html

  You will end up with an html file that looks like so:
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

        <html>
        <head>
          <title>Sprigot</title>
          <link rel="stylesheet" type="text/css" href="sprig.css" />
        </head>

        <body>

          <script src="underscore-min.js"></script>      <script src="d3.v3.min.js"></script>      <script src="sprigotclient.js"></script>


        </body>
        </html>

    Which, yeah, could look better.

It doesn't handle:
------------------
  - Opening and closing tags on the same line.
  - Tags broken across multiple lines.
  - Probably all sorts of other stuff.

