import React from 'react';
import MapData from './MapData.js'
import BaseMap from './BaseMap.js'
import InfoPanel from './InfoPanel.js'
import DetailView from './DetailView.js'
import TopBar from './TopBar.js'
import config from './../config.json'

class MapContainer extends React.Component {
  constructor (props) {
    super(props)

    this.mapData = new MapData()

    this.state = {
      geoJson: {},
      // mapCenter: [],
      // textos: [],
      // userLocation: [],
      // selected: null,
      loaded: false,
      bounds: null,
      center: {lng: config.centroMapa.lon, lat: config.centroMapa.lat},
      selectedPoint: null,
      query: null,
      animate: false,
      searchResults: []
    //  styleURL: this._mapOptions[0].data,
    }
    //this.updateBounds = this.updateBounds.bind(this)
    this.updateSelectedPoint = this.updateSelectedPoint.bind(this)
    this.getNextTexto = this.getNextTexto.bind(this)
    this.getPreviousTexto = this.getPreviousTexto.bind(this)
    this.searchMapData = this.searchMapData.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
  }

  updateSelectedPoint(point, animate) {
    console.log('selected point', point, animate)
    this.setState({selectedPoint: point, animate: animate})
  }

  clearSearch () {
    this.setState({ searchResults: [], query: ''})
  }
  searchMapData(query) {
    var results = this.mapData.searchData(query)
    console.log('results', query, results)
    this.setState({ searchResults: results, query: query})
  }

  getNextTexto(point) {
    var index = point.index
    index++
    if(point.index >= this.state.geoJson.features.length) index = 0
    this.setState({ selectedPoint: this.state.geoJson.features[index], animate: true})
  }

  getPreviousTexto(point) {
    var index = point.index
    index--
    if(point.index < 0) index = this.state.geoJson.features.length - 1
    this.setState({ selectedPoint: this.state.geoJson.features[index], animate: true})
  }
  // updateBounds(newBounds, center) {
  //   console.log('new bounds', newBounds, center)
  //   this.setState({bounds: newBounds})
  // }

  componentDidMount () {
    this.mapData.loadData().then(()=>{
    //  console.log(this.mapData.getGeoJson())

      //this.mapData.getGeoJson()
      this.setState({ geoJson : this.mapData.getTextosGeoJson(), loaded: true})
      //console.log("data loaded")
    })
  }
  // <InfoPanel geoJson={this.state.geoJson} data={this.mapData} loaded={this.state.loaded} bounds={this.state.bounds}/>
  // <DetailView point={this.state.selectedPoint} />
  //updateBounds={this.updateBounds}
  render () {
    return <div>
      <BaseMap
        geoJson={this.state.geoJson}
        loaded={this.state.loaded}
        updateSelectedPoint={this.updateSelectedPoint}
        animate={this.state.animate}
        center={this.state.center}
        selectedPoint={this.state.selectedPoint === null ? null : this.state.selectedPoint.uniqueId}
        searchResults = {this.state.searchResults}
      />
      <DetailView
        point={this.state.selectedPoint}
        getNextTexto = {this.getNextTexto}
        getPreviousTexto = {this.getPreviousTexto}
        searchMapData = {this.searchMapData}
      />
      <TopBar query={this.state.query} searchMapData={this.searchMapData} clearSearch={this.clearSearch} />
    </div>
  }
}

export default MapContainer
