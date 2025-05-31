const quickArt = {
  farmHeader: `
  ---------------------
  |    F A R M        |
  |   G A M E         |
  |   H E A D E R     |
  ---------------------
  `,
  barn: `
    /\\_______/\\
   |  _______  |
   | |       | |
   | |       | |
   |_|_______|_|
  `,
  field: `
  ~~~~~~~~~~~~~~~~~~~~~
  ~  F I E L D        ~
  ~  v V v V v V v    ~
  ~   V v V v V v     ~
  ~~~~~~~~~~~~~~~~~~~~~
  `,
  goat: `
    (\ /)
  __(o.o)__
    /_"\\_\\
  `,
  victoryScreen: `
  **************************
  *                        *
  *    V I C T O R Y !     *
  *                        *
  *   You found the G.O.A.T! *
  *                        *
  *                        *
  **************************
  `,
};

// Export the object for use in other parts of the game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = quickArt;
}
