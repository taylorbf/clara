var composition = {

  structure: [ "B", "A" ],

  sections: {

    "A": {
      duration: 300,
      vol: 1,
      ms: 100,
      parts: [
        [
          {
            pitch: 'gen("sine").fit(ri(1,5,9).get(0)).r(40,10)',
            vel: 1,
            loop: 50
          }
        ],
        [
          {
            pitch: 'data([0]).rep(30).append([9])',
            loop: 10
          }
        ]
      ]
    },
    "B": {
      duration: 300,
      vol: 1,
      ms: 100,
      parts: [
        [
          {
            pitch: 'gen("sine").fit(ri(1,5,9).get(0)).r(30,42)',
            vel: 1,
            loop: 50
          }
        ],
        [
          {
            pitch: 'gen("line").fit(9).r(24,48)',
            loop: 10
          }
        ]
      ]
    }
  }
}


/*
=========

mode - major
ms - 100 - 120
vel - 0.01

pitch: gen("sine").fit(4).r(24,36)
vel: 0.5
dur: 4

pitch: gen("sine").fit(9).r(20,40)
vel: 0.5
dur: 4

pitch: data(0).rep(30).append(8).rep(3)
vel: 0.5
dur: 4

========
=>

pitch: gen("sine").fit(4).r(14,34)
vel: 0.5
dur: 4

pitch: gen("sine").fit(9).r(10,35)
vel: 0.5
dur: 4

pitch: data(0).rep(30).append(8).rep(3)
vel: 0.5
dur: 4

=>

pitch: gen("sine").fit(4).r(28,32)
vel: 0.5
dur: 4

pitch: gen("sine").fit(7).r(30,24)
vel: 0.5
dur: 4

pitch: data(0).rep(30).append(12).rep(3)
vel: 0.5
dur: 4

*/



/*

Nice, need some way to build this over time.
dtm.data(3,4,5).build(2) =>
[3,3,3,4,3,4,3,4,5,3,4,5]



pitch: gen("sine").fit(6).r(0,0)
vel: 0.5
dur: 4

pitch: data(24,12,17,12,19,20,24,26,28,29,31,35)
vel: 0.5
dur: 4

pitch: data(5,37)
vel: 0.5
dur: 4

pitch: data(0)
vel: 0.5
dur: 4




==============

pitch: data(24,30,40).interleave(data(0),1,10)
vel: 0.5
dur: 4

pitch: data(22,32,42).interleave(data(0),1,4)
vel: 0.5
dur: 4

pitch: data(12,18,20).interleave(data(0),1,40)
vel: 0.5
dur: 4

===========

pitch: data(5,25,30,32,34)
vel: 0.5
dur: 4

pitch: data(28,30,32,6)
vel: 0.5
dur: 4

============

pitch: gen("sine").fit(8).r(20,40).interleave(data(0),1,1)
vel: gen("line").r(0,0.2).fit(20)
dur: ri(1,0,5).get(0)

pitch: gen("sine").fit(9).r(20,40).interleave(data(0),1,1)
vel: gen("line").r(0,0.2).fit(20)
dur: ri(1,0,5).get(0)



==============

pitch: gen("sine").fit(ri(1,5,10).get(0)).r(30,44)
vel: 0.2
dur: 4

pitch: data(40).rep(20)
vel: gen("sine").fit(50).r(0,0.5)
dur: 0.1

pitch: data(34).rep(31)
vel: gen("sine").fit(50).r(0,0.5)
dur: 0.1

*/
