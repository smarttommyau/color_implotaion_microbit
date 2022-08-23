
namespace color_implotation {
    export function calculate_pixels(lights: number[][][][]) {
        //  calculate front
        // go and see what does this function does on below
        color_implotation.calculate_plane(0, lights)
        //  z=0 the front plane
        //  calculate end
        color_implotation.calculate_plane(4, lights)
        //  z=4 the back plane
        // now the font and the back plane are solved
        //  we now look the display at the side
        //  for all elements their x,y is the SMALL_HEART
        //  will be  like this
        //  z=0 z=1 z=2 z=3 z=4
        //   c   u   u   u   c
        // so we can consider this as a line and calculate it point by point using the formula
        // you can see that z is n
        // calculate lines by lines
        for (let z = 1; z < 4; z++) {
            for (let y = 0; y < 5; y++) {
                for (let x = 0; x < 5; x++) {
                    lights[z][y][x] = calculatepixel(lights[0][y][x], lights[4][y][x], z)
                }
            }
        }
    }

    // rgb1 z=0
    // rgb2 z=4
    //  pass value n for the formula
    // simpifly the calculation to a 2d plane for front and back only
    // as only their edges are given
    export function calculate_plane(z: number, lights: number[][][][]) {
        let x: number;
        // calculate top line
        //  simple picture to show the current situation
        //  c for calculated, u for unsolved
        //  c u u u c
        for (x = 1; x < 4; x++) {
            lights[z][0][x] = calculatepixel(lights[z][0][0], lights[z][0][4], x)
        }
        //  rgb1(on coord z, first line,first element)
        //  rgb2(on coord z, first line,last element)
        //  pass value n for the formula
        // calculate bottom line
        //  same as above
        for (x = 1; x < 4; x++) {
            lights[z][4][x] = calculatepixel(lights[z][4][0], lights[z][4][4], x)
        }
        //  rgb1(on coord z, last line,first element)
        //  rgb2(on coord z, last line,last element)
        //  pass value n for the formula
        //  another simple picture to show the current situation
        //   c c c c c  y=0
        //   u u u u u  y=1
        //   u u u u u  y=2
        //   u u u u u  y=3
        //   c c c c c  y=4
        // calculate the rest
        // by taking a line like this
        //  c
        //  u
        //  u
        //  u
        //  c
        // run through unsolved cases which is y 1-3
        for (let y = 1; y < 4; y++) {
            for (x = 0; x < 5; x++) {
                lights[z][y][x] = calculatepixel(lights[z][0][x], lights[z][4][x], y)
            }
        }
    }

    // rgb1(on coord z,top,xth element)
    // rgb1(on coord z,bottom,xth element)
    //  pass value n for the formula
    // now the plane is solved
    // using the formula r/g/b =  (r/g/b1 * (m-n) + r/g/b2 *n)/m ratio of rgb1 and rgb2
    // m is known, it is the value of the width of the cube which is 5
    // but in computer arrays we consider the elements start with 0
    // so m is 4(the 5th element)
    function calculatepixel(rgb1: number[], rgb2: number[], n: number): number[] {
        // rounding value with math.round, to keep value in format,no float value(e.g 100.5)
        // float value will cause convertion to hex value rgb failed,return in error
        return [Math.round((rgb1[0] * (4 - n) + rgb2[0] * n) / 4), Math.round((rgb1[1] * (4 - n) + rgb2[1] * n) / 4), Math.round((rgb1[2] * (4 - n) + rgb2[2] * n) / 4)]
    }

    //  Red
    //  Green
    //  Blue
    // this set the calculated pixels to the display
    export function setStrip(strip: neopixel.Strip, lights: number[][][][]) {
        for (let z = 0; z < 5; z++) {
            for (let y = 0; y < 5; y++) {
                for (let x = 0; x < 5; x++) {
                    strip.setPixelColor(y + x * 5 + z * 25, neopixel.rgb(lights[z][y][x][0], lights[z][y][x][1], lights[z][y][x][2]))
                }
            }
        }
        // convert the coords of the 3d to 1d
        //  This function combine the 3 value each 8bit(0-255)to a 24bit value for display
        // red
        // green
        // blue
        strip.show()
    }

}
