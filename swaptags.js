var fs = require('fs');

var settings = {
  inFilename: process.argv[2],
  replacementsFilename: process.argv[3],
  outFilename: process.argv[4],
  readOptions: {
    flags: 'r',
    encoding: 'utf8'
  },
  writeOptions: {
    flags: 'w',
    encoding: 'utf8'
  }
};

settings.errorFilename = settings.outFilename + '.errors';

var session = {
  buffer: '',
  chunkCount: 0,
  lineCount: 0,
  tagBeingProcessed: null
};


var outStream = 
  fs.createWriteStream(settings.outFilename, settings.writeOptions);
var readstream = fs.createReadStream(settings.inFilename, settings.readOptions);

var replacementsString = 
  fs.readFileSync(settings.replacementsFilename, settings.readOptions);
replacementsString = replacementsString.replace(/\n/g, '');

try {
  settings.replacements = JSON.parse(replacementsString);
}
catch (e) {
  debugger;
  process.stderr.write('Could not parse replacements JSON file: ' + 
    e.toString() + '\n');
  process.exit(-1);
}


readstream.on('readable', function startReading() {
  var chunk = null;
  while (null !== (chunk = readstream.read())) {
    do {
      chunk = processDataChunk(chunk);
      if (chunk.indexOf('\n') === -1) {
        session.buffer += chunk;
        break;
      }
    }
    while (chunk.length > 0);

    ++session.chunkCount;
  }
});

readstream.on('end', function streamEnded() {
  outStream.write(session.buffer);
  outStream.end();
});


var lineCount = 0;

function processDataChunk(chunk) {
  var remainder = '';
  var linebreakPos = chunk.indexOf('\n');

  if (linebreakPos === -1) {
    session.buffer += chunk;
  }
  else {
    var line = session.buffer + chunk.substring(0, linebreakPos + 1);
    session.buffer = '';
    remainder = chunk.substr(linebreakPos + 1);

    processLine(line);
    ++lineCount;
  }

  return remainder;
}

function processLine(line) {
  if (session.tagBeingProcessed) {
    var endTagPos = line.indexOf(session.tagBeingProcessed);
    if (endTagPos > -1) {
      outStream.write(settings.replacements[session.tagBeingProcessed] + '\n');
      outStream.write(line.substr(endTagPos + session.tagBeingProcessed.length));
      session.tagBeingProcessed = null;
    }
  }
  else {
    lookForAReplacementTagInLine(line, function done(foundTag, startTagPos) {
      if (startTagPos > -1) {
        session.tagBeingProcessed = foundTag;
        outStream.write(line.substring(0, startTagPos));
      }
      else {
        outStream.write(line);
      }
    });
  }

  ++session.lineCount;

}

// done params: tag, tag position.
function lookForAReplacementTagInLine(line, done) {
  var position = -1;
  var foundTag = null;

  for (var tag in settings.replacements) {
    position = line.indexOf(tag);
    if (position > -1) {
      foundTag = tag;
      break;
    }
  }

  done(foundTag, position);
}
