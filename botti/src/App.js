import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Navbar, Button, ButtonGroup, Form, Input, Container, Collapse, NavbarToggler, Nav, NavbarBrand } from 'reactstrap';
import { faSync } from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import queryString from 'query-string'

class App extends Component {

  constructor(props) {
    super(props);
    var s = "";
    if (window.location.search != null) {
      var query = queryString.parse(window.location.search);
      if (query['s']) s = query['s']
    }
    this.state = {
        team : "",
        teamFilter : 0, 
        clips : [],
        search : s,
        filter : 0,
        goals : false,
        recaps : false,
        penalties : false,
        collapsed : true,
        sticky : 'top', 
    };
  }

  handleClick(teamName) {
    this.setState(state => ({
      team : teamName,
      teamFilter : 1
    }));
  }

  handleAllClick() {
    this.setState(state => ({
      team : "",
      teamFilter : 0
    }));
  }

  handleFilter(filter) {
    this.setState(state => ({filter : filter}))
  }

  search(e){
    this.setState({
      search: e.target.value,
    })
  }

  reload() {
    var _this = this;
    axios
     .get("https://liigabotti.net/results_sorted.json")
    // .get("http:///localhost:3000/results_sorted.json")
      .then(function(result) {    
        _this.setState({
          clips: result.data
        });
      })
  }

  toggleNavbar() {
    var newSticky = 'false'
    if (!this.state.collapsed) { newSticky = 'top'}
    this.setState({
      collapsed: !this.state.collapsed,
      sticky: newSticky
    });
    if (newSticky === 'false') {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return (
      <div>
       
        <Navbar color="light" light sticky={this.state.sticky} expand="lg">
        {/* sticky={'top'} <NavbarBrand><a class="navbar-brand" href="/"><img src="favicon.ico"></img></a></NavbarBrand> */}
        <Button color ="link" size="sm" onClick={ () => this.reload() }><FontAwesomeIcon icon={faSync}/></Button>
        <NavbarToggler  onClick={ () => this.toggleNavbar() } className="mr-2" />
        <Collapse isOpen={!this.state.collapsed} navbar>
        <Nav className="ml-auto mr-auto" navbar> 
        <ButtonGroup vertical={!this.state.collapsed}>
        <Button color="primary" size="sm" active={this.state.team === ""} onClick={ () => this.handleAllClick() }>Kaikki</Button>
        <Button color="primary" size="sm" active={this.state.team === "HIFK"} onClick={ () => this.handleClick("HIFK") }>HIFK</Button>
        <Button color="primary" size="sm" active={this.state.team === "HPK"} onClick={ () => this.handleClick("HPK") }>HPK</Button>
        <Button color="primary" size="sm" active={this.state.team === "Ilves"} onClick={ () => this.handleClick("Ilves") }>Ilves</Button>
        <Button color="primary" size="sm" active={this.state.team === "Jukurit"} onClick={ () => this.handleClick("Jukurit") }>Jukurit</Button>
        <Button color="primary" size="sm" active={this.state.team === "JYP"} onClick={ () => this.handleClick("JYP") }>JYP</Button>
        <Button color="primary" size="sm" active={this.state.team === "KalPa"} onClick={ () => this.handleClick("KalPa") }>KalPa</Button>
        <Button color="primary" size="sm" active={this.state.team === "KooKoo"} onClick={ () => this.handleClick("KooKoo") }>KooKoo</Button>
        <Button color="primary" size="sm" active={this.state.team === "Kärpät"} onClick={ () => this.handleClick("Kärpät") }>Kärpät</Button>
        <Button color="primary" size="sm" active={this.state.team === "Lukko"} onClick={ () => this.handleClick("Lukko") }>Lukko</Button>
        <Button color="primary" size="sm" active={this.state.team === "Pelicans"} onClick={ () => this.handleClick("Pelicans") }>Pelicans</Button>
        <Button color="primary" size="sm" active={this.state.team === "SaiPa"} onClick={ () => this.handleClick("SaiPa") }>SaiPa</Button>
        <Button color="primary" size="sm" active={this.state.team === "Sport"} onClick={ () => this.handleClick("Sport") }>Sport</Button>
        <Button color="primary" size="sm" active={this.state.team === "Tappara"} onClick={ () => this.handleClick("Tappara") }>Tappara</Button>
        <Button color="primary" size="sm" active={this.state.team === "TPS"} onClick={ () => this.handleClick("TPS") }>TPS</Button>
        <Button color="primary" size="sm" active={this.state.team === "Ässät"} onClick={ () => this.handleClick("Ässät") }>Ässät</Button>
        </ButtonGroup>
        &nbsp;
        <ButtonGroup vertical={!this.state.collapsed}>
          <Button color="secondary" size="sm" active={this.state.filter === 0} onClick={ () => this.handleFilter(0)}>Kaikki</Button>
          <Button color="secondary" size="sm" active={this.state.filter === 1} onClick={ () => this.handleFilter(1)}>Kooste</Button>
          <Button color="secondary" size="sm" active={this.state.filter === 2} onClick={ () => this.handleFilter(2)}>Maali</Button>
          <Button color="secondary" size="sm" active={this.state.filter === 3} onClick={ () => this.handleFilter(3)}>Rangaistus</Button>
        </ButtonGroup>
        &nbsp;
        <Form>
          <Input value={this.state.search} type="text" onChange={this.search.bind(this)} placeholder="Haku"  bsSize="sm"></Input>
        </Form>
        </Nav>
        </Collapse>
        </Navbar>

        <Container>
        { this.state.clips.slice(0).reverse().filter(clip =>  {
          var search = String(this.state.search);
          var title = String(clip.title);
          var subtitle = String(clip.subtitle);
          var match = 
            title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) 
            || subtitle.toLocaleLowerCase().includes(search.toLocaleLowerCase());
          switch (this.state.filter) {
            case 1:
              match = match && title.toLocaleLowerCase().includes("kooste");
            break;
            case 2:
              match = match && title.toLocaleLowerCase().includes("maali");
            break;
            case 3:
              match = match && title.toLocaleLowerCase().includes("rangaistu");
            break;
            default:
            break;
          }
          return (match && (this.state.teamFilter === 0 || clip.homeTeamName===this.state.team || clip.awayTeamName===this.state.team));
        }).map((clip, i, array) => {
          var link = "https://videos.liiga-services.telia.fi/embed/"+clip._id;
          var show = i === 0 || (i > 0 && array[i].gameDate !== array[i - 1].gameDate);
          var useGameDate = (show && clip.gameDate);
          var useTeams = this.state.teamFilter === 0;
          
          return (
            <div key={clip.id} className="clip">
            <DateHeader gameDate={useGameDate} clip={clip} useTeams={useTeams}/>
            <ClipInfo useTeams={useTeams} clip={clip} link={link}/>
            </div>
          );
        })}
         &nbsp;
        </Container>
        <div className="footer fixed-bottom bg-light "><center>liigabotti.net</center></div>
      </div>
    )
  }

  componentDidMount() {
    var _this = this;
    this.serverRequest = 
      axios
       .get("https://liigabotti.net/results_sorted.json")
      // .get("http:///localhost:3000/results_sorted.json")
      // .get("http:///192.168.10.46:3000/results_sorted.json")
        .then(function(result) {    
          _this.setState({
            clips: result.data
          });
        })
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

}

function DateHeader(props) {
  if (props.gameDate != "") {
    if (!props.useTeams) {
      return <h4>
      {props.gameDate}
      &nbsp;{props.clip.homeTeamName}
      &nbsp;-&nbsp; 
      {props.clip.awayTeamName}
      </h4>
    } else {
      return <h4>{props.gameDate}</h4>
    }
  } else return <div></div>
}

function ClipInfo(props) {
  var minutes = Math.floor(props.clip.eventTime / 60);
  if (minutes < 10) minutes = "0"+minutes;
  var seconds = props.clip.eventTime % 60;
  if (seconds < 10) seconds = "0"+seconds;
  var time = minutes + ":"+seconds;

  var totalTitle = "";
  if (time != "00:00") totalTitle = time + " - " ;
  totalTitle = totalTitle + props.clip.title;
  if (props.clip.subtitle != "") {
    totalTitle = totalTitle + " - " + props.clip.subtitle;
  }

  if (props.useTeams === true) {
    return <li><a href={props.link} className="link" target="_new">
    &nbsp;{props.clip.homeTeamName}
    &nbsp;-&nbsp; 
    {props.clip.awayTeamName}
    &nbsp;-&nbsp;
    {totalTitle}
    </a></li>
  } else  {
    return <li><a href={props.link} className="link" target="_new">
    {totalTitle}
    </a></li>
  }
}


export default App;
