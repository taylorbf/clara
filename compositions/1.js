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
            pitch: 'gen("sine").fit(3).r(24,48)',
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
