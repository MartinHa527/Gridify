import React, { useEffect, useRef, useState } from 'react';
import { catchErrors } from '../utils';
import {
    getCurrentUserProfile,
    getTopTracks,
    getCurrentUserPlaylists,
    getPlaylistTracks
} from '../spotify';
import { GlobalStyle } from '../styles';
// add functionality to change the different playlist images 

function SpotifyImage(props) {
    const canvasRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const [topTracks, setTopTracks] = useState([null]);
    const [playlists, setPlaylists] = useState(null);
    
    useEffect(() => {
      const fetchData = async () => {
      
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile.data);

        const userTopTracks = await getTopTracks();
        setTopTracks(userTopTracks.data.items);

        const userPlaylists = await getCurrentUserPlaylists();
        setPlaylists(userPlaylists.data);
        
      };
  
      catchErrors(fetchData());
      
    }, []);
    const [date, setDate] = useState(null);
    useEffect(() => {
        if (playlists) {
            const fetchData = async () => {
                const userDate = await getPlaylistTracks(playlists.items[0].id);
                setDate(userDate.data);
            };
    
            catchErrors(fetchData());
        }
    }, [playlists]);

    
    useEffect(() => {
        
        if (profile && topTracks && playlists && date){
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const devicePixelRatio = window.devicePixelRatio || 1;

        canvas.width = 1080 * devicePixelRatio;
        canvas.height = 1440 * devicePixelRatio;
    
        canvas.style.width = '540px';   // CSS styles to ensure the displayed size remains consistent.
        canvas.style.height = '720px';
       
        
        ctx.scale(devicePixelRatio, devicePixelRatio);
        var paperImg = new Image();
        paperImg.crossOrigin = 'anonymous';
        paperImg.src = "data:image/jpeg;base64,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"
        paperImg.onload = function() {
            // Create a pattern with the image
            var pattern = ctx.createPattern(paperImg, "repeat");
            
            // Set the pattern as fill style
            ctx.fillStyle = pattern;
            
            // Fill the canvas with the pattern
            ctx.fillRect(0, 0, 1080, 1440);
        };
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Setting text color
        // Assuming we have an album art URL from Spotify in props.data.albumArt
        const img = new Image();
        const profileImage = new Image();
        const playlistImage = new Image();
        profileImage.crossOrigin = 'anonymous';
        playlistImage.crossOrigin = 'anonymous';

        const dropdown = document.getElementById('numberDropdown');
        dropdown.innerHTML = '';  // clear existing options
        const maxLength = Math.min(20, playlists.items.length);

        for(let i = 1;  i <= maxLength; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent =i;
            dropdown.appendChild(option);
        }   
        playlistImage.src = playlists.items[0].images[0].url;
        dropdown.addEventListener('change', function() {
            const selectedIndex = dropdown.selectedIndex;  // This will give the index of the selected option
            if (playlists.items[selectedIndex] && playlists.items[selectedIndex].images && playlists.items[selectedIndex].images[0]) {
                playlistImage.src = playlists.items[selectedIndex].images[0].url;
                playlistImage.onload = () => {
                    drawOnCanvas();
                }
            } else {
                console.error("Selected playlist or image not available.");
            }
        });
        function drawOnCanvas() {
            // Just draw the dynamic part, i.e., the playlistImage
            ctx.drawImage(playlistImage, 125*2, 150*2,140*2,140*2);
        }
        profileImage.src = profile.images[1].url;
        img.crossOrigin = "anonymous";
        img.src = "/lifeOfPablo.jpg";

      

        img.onload = () => {
            ctx.drawImage(img, 30*2, 20*2, 480*2, 460*2); // Draw album art on canvas
            
            ctx.font = "bold 20px 'Centaur Regular";
            // Display song titles below the album art
            const startY = 570*2;
            const gap = 13*2;
            let albumLength = 0;
            if (topTracks.length >1) {
                ctx.fillStyle = "black";
                topTracks.slice(0, 10).forEach((item, index) => {
                    const listItem = `${index + 1}. ${item.name}`;  // Prepend the number to each song name
                    ctx.fillText(listItem, 60, startY + (index * gap));
                    albumLength += item.duration_ms;
                });
            }
          
            // Second row
            if (topTracks.length >1) {
                ctx.fillStyle = "black";
                topTracks.slice(10,20).forEach((item,index) => {
                    const listItem = `${index + 11}. ${item.name}`;
                    ctx.fillText(listItem, 2*230, startY + (index *gap));
                    albumLength += item.duration_ms;

                });
            }
            // Changes millisceonds of sum to minutes/seconds fomrat
            const totalSeconds = Math.floor(albumLength / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;


            if ( profile.display_name) {
            ctx.font = "bold 80px Centaur Regular";
            ctx.fillText('The Life of ' +  profile.display_name.split(' ')[0], 60,1060);
            }
            ctx.drawImage(profileImage, 265*2, 330*2,110*2,110*2);
            // Change this image to the most played playlist 
            ctx.drawImage(playlistImage, 125*2, 150*2,140*2,140*2);


            
            // Change this image to the most played playlist 

            // Generates a black line 
            ctx.strokeStyle = "black"; 
            ctx.beginPath();
            ctx.moveTo(60,1100);
            ctx.lineTo(1020,1100);
            ctx.stroke();

            // Add Release Date - Oldest Playlist Release Date 
            const sortedTracks = date.items.sort((a, b) => {
                return new Date(a.added_at) - new Date(b.added_at);
            });
            const oldestAddedDate = new Date(sortedTracks[0].added_at);
            // Convert the date into "Alphabetical Month, Numerical Day, Numerical Year" format
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const releaseDate = `${monthNames[oldestAddedDate.getMonth()]}, ${oldestAddedDate.getDate()}, ${oldestAddedDate.getFullYear()}`;

            
            ctx.textAlign ='right';
            // ADD Album Length
            ctx.font = "bold 28px Centaur Regular"
            ctx.fillText("Album Length",505*2,570*2);
            ctx.font = "28px Centaur Regular";
            ctx.fillText(formattedDuration,505*2,590*2);
            // ADD Release Data aka the date of the 
            ctx.font = "bold 28px Centaur Regular"
            ctx.fillText("Release Date",505*2,625*2);
            ctx.font = "28px Centaur Regular";
            ctx.fillText(releaseDate,505*2, 640*2);

            ctx.font = "bold 28px Centaur Regular"
            ctx.fillText("Presented by",505*2,675*2);
            ctx.fillText("life-of.herokuapp.com", 505*2,690*2);
            ctx.textAlign = 'left';
            
            const firstName = profile.display_name.split(' ')[0];
            const capitalizedFirstName = firstName.toUpperCase();
            
            ctx.save();
            ctx.rect(200*2,0,310*2,720*2);
            ctx.clip();
            ctx.font = 'bold 64px Segoe UI  ';
            // change to different shade of black
            ctx.fillStyle = 'black';
            ctx.fillText(capitalizedFirstName, 375*2, 2*65);
            ctx.fillText(capitalizedFirstName,640, 200);
            ctx.fillText(capitalizedFirstName,640, 270);
            ctx.fillText(capitalizedFirstName,640, 340);
            ctx.fillText(capitalizedFirstName,640, 410);
            ctx.fillText(capitalizedFirstName,640, 480);
            ctx.fillText(capitalizedFirstName,640, 624);
            
            ctx.restore();

            }   
        document.getElementById('downloadBtn').addEventListener('click', downloadCanvas);

        // Cleanup the event listener
        return () => {
            document.getElementById('downloadBtn').removeEventListener('click', downloadCanvas);
        }
            
        }

        
    }, [profile,topTracks,playlists,date]);

    function downloadCanvas() {
        const canvas = canvasRef.current;
        const downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = 'spotifyImage.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    return (
        <div className="canvas-container">
            <div className="canvas-row">
                <canvas ref={canvasRef} />
                <div>
                    <label htmlFor="numberDropdown" className = 'select-label'>Select Image:</label>
                    <select id="numberDropdown"></select>       
                </div>
            </div>
            <div className="button-container">
                <button id="downloadBtn">Download Image</button>  
                 
            </div>
            <div className="made-by">Made by Martin Ha</div>
        </div>
    );
}

export default SpotifyImage;
