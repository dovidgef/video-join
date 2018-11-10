#!/usr/bin/env node

console.log('Video Join Tool');

const glob = require("glob");
const cmd = require('node-cmd');
const fs = require('fs');
const psTree = require('ps-tree');

let cmd_one_proc, cmd_two_proc;

// options is optional
glob("**/*.[mM][tT][sS]", {}, function (er, files) {
  // files is an array of file names with MTS extension.

  // Only attempt to combine videos when more than one in folder
  if (files.length > 1) {
    // Generate file name list for commands
    let mtsList = '';
    for (let i = 0; i < files.length; i++) {
      console.log(files[i]);
      mtsList += '".\\' + files[i] + '"+';
    }
    // Add white space
    console.log("\n\n");
    mtsList = mtsList.slice(0, -1);


    let videoFileName = "\".\\" + files[0].slice(0, -4) + " combined.TS\"";
    let metaFile = ".\\00.meta";
    let audioFile = '".\\00.ac3"';
    let audioLogFile = ".\\00 - Log.txt";
    let tsCommand1 = "MUXOPT --no-pcr-on-video-pid --new-audio-pes --vbr --vbv-len=500";
    let tsCommand2 = "V_MPEG4/ISO/AVC";
    let tsCommand3 = "fps=, insertSEI, contSPS, track=4113";
    let tsCommand4 = "A_AC3, " + audioFile + ", track=4352";

    let metaFileContents = tsCommand1 + "\r\n";
    metaFileContents += tsCommand2 + ", " + mtsList + ", " + tsCommand3 + "\r\n";
    metaFileContents += tsCommand4 + "\r\n";
    fs.writeFileSync(metaFile, metaFileContents);

    // Run commands
    let cmd_one = "eac3to" + " " + mtsList + " " + audioFile;
    let cmd_two = "tsMuxeR" + " " + metaFile + " " + videoFileName;

    cmd_one_proc = cmd.get(cmd_one, function (err, data, stderr) {
        if (err || stderr) {
          console.log("Error: " + err + " stderr: " + stderr);
        }
        else {
          cmd_two_proc = cmd.get(cmd_two, function (err, data, stderr) {
              if (err || stderr) {
                console.log("Error: " + err + " stderr: " + stderr);
              }
              else {
                // Delete extra files
                console.log("Deleting Files!");
                fs.unlinkSync("00.ac3");
                fs.unlinkSync(audioLogFile);
                fs.unlinkSync("00.meta");
                // Change to MTS extension after finished muxing
                fs.renameSync(videoFileName.slice(1, -1), videoFileName.slice(1, -3) + "MTS");
              }
            }
          );
          // Print output as it is sent
          cmd_two_proc.stdout.on('data', output);
        }
      }
    );

    // Print output as it is sent
    let data_line = '';
    cmd_one_proc.stdout.on('data', output);

    function output(data) {
      data_line += data;
      // Output whole lines only
      if (data_line[data_line.length - 1] === '\n') {
        // Check and handle dirty bytes error
        if (data_line.includes('PES')){
          if(cmd_one_proc) {
            // console.log("process:", util.inspect(cmd_one_proc));
            cmd_one_proc.stdout.removeListener('data', output);
            psTree(cmd_one_proc.pid, function (err, children) {
                children.map(function (p) {
                  // noinspection JSUnresolvedVariable
                  process.kill(p.PID);
                });
                throw "Error: video file has dirty PES bytes, please manually join files using tsMuxers GUI";
            });
          }
        } else {
            console.log(data_line.trim(), '\n');
        }
      }
    }
  }
});


