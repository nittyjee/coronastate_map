
## Changes made
1. to index.html (on 5/1/2020)
* Added d3.js script
* Slider will range from 1/25/2020 to yesterday's date
* Used d3.csv to read csv file
* Updated the footnotes with ids: confirmed_id, recovered_id, deaths_id, active_id
* Based on the slider's position, update the html content of the above metrics in comma formatted position
2. Added a new file display_line.html (5/2/2020)
* Created a line graph that displays line graph and is synced with all  
3. Added display_bar.html (5/3/2020)
* Created an animated bar graph showing the top 10 countries by confirmed cases
4. Copied display_bar.html to display_bar_v1.html to create static maps first


5/7/2020
Copied Arsen's final file to hima_map folder.

5/9/2020
Cleaned up the file in coronastate_v3.
This has the following:
- Line chart and table unlinked. It contains data from JHU's upddate
- Unlinked the slider from those charts so that the map will reflect the latest date.

coronastate_v3.2
 - Nitin's update
 
coronastate_v3.3
 - Hima's update
 - The total summary at the top left hand side of the dashboard was relying on covid19 data source.
 - Pointed it to our inhouse data summary and is more reliable because it runs every hour.

coronastate-v3.4
  - Hima's update
  - The total summary is now syncing up to the timeline.
  - 
coronastate_hover
  - This is what Nitin gave as implementing hover.
  
coronastate-v3.4.2
  - Hima's update
  - updated index.html with what Nitin gave. This will take care of the mobile version of the site

coronastate-v3.4.3
  - Hima's update
  - Updated hover code on adm0
 
coronastate-v3.4.4
  - Santiago's update
  - Santiago made some updates, added a "data" button and a google drive embed for the "about" modal button. So much better
coronastate-v3.4.5
  - Santiago's fix
  
coronastate-v3.4.6
  - Hima's update
  - Replace bars with text numbers, like JHU
  - Show last updated time.
  
coronastate-v3.4.7
  - Hima's update
  - Click on line graph to expand.
  - Make changes to small graph.
  - Updated the table on the left to update with the slider
  
v3.4.8
  - HIma's update
  - Delete map_elements.jpg file
  - Enabled selection of text
  
To do
-----
1. Replace the csv aggregate used in index.html from JHU to coronastate's data aggregate
