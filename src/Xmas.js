import React, { Component } from 'react'
import p5 from 'p5'
import qs from 'query-string'
import './Xmas.css'
import Slider from 'rc-slider'
import isUrl from 'is-url'

import 'rc-slider/assets/index.css'

class Xmas extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pixelSize: 20,
      image: qs.parse(window.location.search).image,
      id: qs.parse(window.location.search).id,
      squarePixels: false,
      flicker: false,
      controls: true,
    }
  }
  componentDidMount() {
    if (this.state.id) {
      let pixelsize = 20

      // Individuall set pixels resembling physical cards
      switch (this.state.id) {
        case '0':
          pixelsize = 110
          break
        case '1':
          pixelsize = 66
          break
        case '2':
          pixelsize = 90
          break
        case '3':
          pixelsize = 42
          break
        case '4':
          pixelsize = 190
          break
        case '6':
          pixelsize = 88
          break
        case '7':
          pixelsize = 22
          break
        case '8':
          pixelsize = 52
          break
        default:
          pixelsize = 40
          break
      }
      this.setState(
        {
          image: 'img/xmas-2018-' + this.state.id + '.jpeg',
          squarePixels: true,
          flicker: true,
          pixelSize: pixelsize,
          controls: false,
        },
        () => {
          this.p5instance = new p5(
            this.sketch,
            document.getElementById('p5sketch')
          )
        }
      )
    } else if (this.state.image) {
      this.p5instance = new p5(this.sketch, document.getElementById('p5sketch'))
    }
  }

  sketch = sketch => {
    sketch.preload = () => {
      sketch.img = sketch.loadImage(this.state.image)
    }
    sketch.setup = () => {
      sketch.createCanvas(sketch.img.width, sketch.img.height)
      sketch.imageMode(sketch.CENTER)
      sketch.noStroke()
      sketch.background(255)
      sketch.img.loadPixels()
    }

    sketch.draw = () => {
      pixelate(
        this.state.pixelSize,
        this.state.squarePixels,
        this.state.flicker
      )
      if (this.state.flicker) {
        animate(100, 200)
      }
    }

    /* DRAW HELPERS */

    let animate = (floor, ceiling) => {
      let frame = sketch.frameCount % 8
      if (frame === 0) {
        //HACK: directly mutating state just a bit
        this.state.pixelSize = this.state.pixelSize + Math.random() * 0.01
      } else if (frame === 1) {
        this.state.pixelSize = this.state.pixelSize - Math.random() * 0.01
      }
    }

    function drawPixels(x, y, size, height, useColorize) {
      let color = sketch.img.get(x, y)
      if (useColorize) {
        sketch.fill(colorize(color))
      } else {
        sketch.fill(color)
      }
      sketch.rect(x, y, size, height)
    }

    function colorize(color) {
      color[0] += Math.floor(Math.random() * 10)
      color[1] += Math.floor(Math.random() * 10)
      color[2] += Math.floor(Math.random() * 10)
      return color
    }

    function pixelate(size, square, flicker) {
      let ratio
      if (!square) {
        if (sketch.width < sketch.height) {
          ratio = sketch.height / sketch.width
        } else {
          ratio = sketch.height / sketch.width
        }
      } else {
        ratio = 1
      }
      let pixelHeight = size * ratio
      for (let x = 0; x < sketch.width; x += size) {
        for (let y = 0; y < sketch.height; y += pixelHeight) {
          drawPixels(x, y, size, pixelHeight, flicker)
        }
      }
    }
  }

  updateValue = value => {
    this.setState({ pixelSize: value })
  }

  handleSquareChange = event => {
    this.setState({ squarePixels: event.target.checked })
  }

  handleFlickerChange = event => {
    this.setState({ flicker: event.target.checked })
  }

  getImage = event => {
    if (isUrl(event.target.value)) {
      this.setState({ image: event.target.value }, () => {
        if (!this.p5instance) {
          this.p5instance = new p5(
            this.sketch,
            document.getElementById('p5sketch')
          )
        }
      })
    }
  }

  render() {
    let render, controls
    if (this.state.image) {
      render = <div className="useless-lol">Do the img</div>
    } else {
      render = (
        <input
          className="url"
          placeholder="Image URL"
          onChange={this.getImage}
        />
      )
    }
    if (!this.state.controls) {
      controls = 'settings hide-controls'
    } else {
      controls = 'settings'
    }
    return (
      <div className="Xmas">
        {render}
        <div id="p5sketch" />
        <div className={controls}>
          <label>Adjust pixel size</label>
          <Slider
            defaultValue={this.state.pixelSize}
            id="pixelate-slider"
            onChange={this.updateValue}
            min={10}
            max={400}
          />
          <label>Square pixels</label>
          <input
            type="checkbox"
            name="square"
            checked={this.state.squarePixels}
            onChange={this.handleSquareChange}
          />
          <label>Flicker</label>
          <input
            type="checkbox"
            name="square"
            checked={this.state.flicker}
            onChange={this.handleFlickerChange}
          />
        </div>
      </div>
    )
  }
}

export default Xmas
