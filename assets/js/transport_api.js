// Extract TFL tube line and station details using the TFL (transport for london) api which returns
// data in JSON format. Data includes tube line names and stations for each tube line along with
// their coordinates

const app_id = 'af98ba75';
const api_key = '2f417dd4be1cf9870d344c5455e94b2b';
const tfl_api_url = 'https://api.tfl.gov.uk';

// Fetch all tube lines from the TFL api. Then for each tube line, we need to fetch
// all stops so that they can be presented to the user in the form of a dropdown list.

function fetchTFLdata(lineid) {
  $.when(
    $.getJSON(`${tfl_api_url}/Line/Mode/tube?app_id=${app_id}&app_key=${api_key}`)
  ).then(
    function(tube_lines) {

      // Loop through each tube line returned in the TFL API response
      // and retrieve all stops for the selected tube line via a second API call

      tube_lines.forEach(function(tube_line) {
        if (tube_line.id == lineid) {
          fetchLineStops(tube_line.id);
        }
      });
    },
    function(errorResponse) {
      if (errorResponse.status == 404) {
        error_heading.text(`TFL data not found`);
      } else {
        console.log(errorResponse);
        error_heading.text(`Error: ${errorResponse.reponseJSON.message}`);
      }
    }
  )
}

// Fetch all stations relevant to a specific tube line

function fetchLineStops(line_id) {

  // Wait for the api request to return the stops for a specific tube line
  // before proceeding to populate the station drop down

  $.when(
    $.getJSON(`${tfl_api_url}/line/${line_id}/stoppoints?app_id=${app_id}&app_key=${api_key}`)
  ).then(
    function(stations) {
      
      // Render all retrieved stops in the drop down list

      $("#stops").append(`<div id="dropdown">
                            <select class="form-control stations" onchange="refresh_dashboard_content();" id="station_dropdown"></select>
                          </div>`);
      $("#station_dropdown").append(`<option value='0' lat="999" lon="999" disabled selected>
                                       Select a tube station
                                     </option>`);
      stations.forEach(function(element) {
        $("#station_dropdown").append(`
            <option value="${element.commonName}" lat="${element.lat}" lon="${element.lon}">
              ${element.commonName}
            </option>`);
      });
      $("#dropdown").addClass("dropdown-" + $(".dashboard-sidebar .sidebar-button.active").attr('data-lineid'));
    },
    function(errorResponse) {
      if (errorResponse.status == 404) {
        error_heading.text(`No info found`);
      } else {
        console.log(errorResponse);
        error_heading.text(`Error: ${errorResponse.reponseJSON.message}`);
      }
    }
  )
}
