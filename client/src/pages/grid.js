import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import {
  getCurrentUserProfile,

  getTopTracks
} from '../spotify';
import {
  SpotifyImage
} from '../components';

const Grid = () => {
  const [profile, setProfile] = useState(null);
  const [topTracks, setTopTracks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile();
      setProfile(userProfile.data);
      const userTopTracks = await getTopTracks();
      setTopTracks(userTopTracks.data);
    };

    catchErrors(fetchData());

  }, []);
  
  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
        {profile && (
            <>
                <div className="canvas-container">
                    {topTracks && <SpotifyImage topTracks={topTracks} />}
                </div>
            </>
        )}
    </div>
);
};

export default Grid;