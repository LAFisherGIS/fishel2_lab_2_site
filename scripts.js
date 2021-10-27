$(document).ready(modeCheck);
$(document).ready(mapping);

/* This code is based on Tero Karvinen's reference implementation (https://terokarvinen.com/2018/save-checkbox-state-to-localstorage-javascript-and-jquery-example/) for the use of localStorage to preserve the state of a checkbox between pages and sessions. */
function modeCheck(){
  let checked="true"==localStorage.getItem("status");
  $("#lightordark").prop('checked', checked)
  $("#lightordark").click(modeSet);
}

function modeSet(){
  let checked=$("#lightordark").is(":checked");
  localStorage.setItem("status", checked);
}

// End Tero-based scripting

function mapping(){
  var mymap = L.map('map').setView([47.2528769, -122.4442906], 12);
  var basemap = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(mymap);

  $.getJSON("Data/Neighborhood_Council_Districts_(Tacoma).geojson",function(data){
     L.geoJson(data, {
       style: {color:'grey'}
       }).addTo(mymap);
  });

  $.getJSON("Data/School_Grounds.geojson",function(data){
     L.geoJson(data, {
       style: function(feature){
         if (feature.properties.CITY === "TACOMA") return {opacity:1, color:'black'}
         else return {opacity:0}
       }
       }).addTo(mymap);
  });

  $.getJSON("Data/Contaminated_Sites_(Ecology).geojson",function(data){
     L.geoJson(data, {
       pointToLayer: function(feature, latlng){
        var riskColor,
        risk = feature.properties.SiteRank;
          if (feature.properties.SiteRank === "0 - NPL Site (Fed HRS Score)") riskColor = 'maroon';
          else if (feature.properties.SiteRank === "1 - Highest Assessed Risk") riskColor = 'red';
          else if (feature.properties.SiteRank === "2 - Moderate-High Risk") riskColor = 'orangered';
          else if (feature.properties.SiteRank === "3 - Moderate Risk") riskColor = 'orange';
          else if (feature.properties.SiteRank === "4 - Low-Moderate Risk") riskColor = 'goldenrod';
          else if (feature.properties.SiteRank === "5 - Lowest Assessed Risk") riskColor = 'yellow';
         var marker = L.circle(latlng, {radius: 200, color: riskColor});
         if (feature.properties.SiteRank !== "")
         return marker;
       }
     }).addTo(mymap);
  });

  L.MakiMarkers.accessToken = "sk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t2OXJ4dnV1YTY2ZjJwbnpjM3BxbWRnYiJ9.CW4oaT94TkbelBF0Fj4rJw";

  const schoolIcon = L.MakiMarkers.icon({
    icon: "school",
    color: "006400",
    size: "s"
  });

  $.getJSON("Data/Schools.geojson",function(data){
     L.geoJson(data, {
       pointToLayer: function(feature, latlng){
         var marker = L.marker(latlng, {icon: schoolIcon});
         marker.bindPopup("Name: " + feature.properties.NAME + "<br>Address: " + feature.properties.ADDRESS + "<br> School Type: " + feature.properties.TYPE)
         if (feature.properties.CITY === "TACOMA")
         return marker;
       }
     }).addTo(mymap);
  });
}
