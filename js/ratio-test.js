var ji = [1/1,16/15,9/8,6/5,5/4,4/3,11/8,3/2,8/5,5/3,9/5,15/8];

// must compare frequency of new note to an mtof note

function ratioBetween(start,target) {
  var startdegree = start % 12;
  var startoctave = Math.floor(start / 12);

  var targetdegree = target % 12;
  var targetoctave = Math.floor(target / 12);

  var startratio = octavify( ji[startdegree], startoctave );
  var targetratio = octavify( ji[targetdegree], targetoctave );

  var ratio =  targetratio / startratio;
  return ratio;
}

function octavify(ratio,oct) {
  return Math.pow(2,oct) * ratio;
}

function mtof = function(midi) {
  return Math.pow(2, ((midi-69)/12)) * 440;
}

let middleC = mtof(60);
