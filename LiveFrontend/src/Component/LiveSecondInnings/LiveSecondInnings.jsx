import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Title from '../Title/Title';
import { io } from 'socket.io-client';

const socket = io("https://cric-scoreboard.onrender.com/");

const SecondInnings = () => {
  const navigate = useNavigate();

  const [target, setTarget] = useState(0);
  const [battingTeam, setBattingTeam] = useState('Loading');
  const [bowlingTeam, setBowlingTeam] = useState('_');
  const [currentRun, setCurrentRun] = useState(0);
  const [currentWicket, setCurrentWicket] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [overs, setOvers] = useState("0.0");
  const [iningsOver, setIningsOver] = useState(false);
  const [battingTeamWon, setBattingTeamWon] = useState(false);
  const [bowlingTeamWon, setBowlingTeamWon] = useState(false);
  const [bowlingStarted, setBowlingStarted] = useState(false)

  useEffect(()=>{
    const data = JSON.parse(localStorage.getItem('targetDetails'))
    console.log(data)
    setTarget(data.targ)
    setBattingTeam(data.battingteam)
  },[])

  // Load live session data
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('liveFirstInningsData'));
    if (data) {
      setCurrentRun(data.runs);
      setCurrentWicket(data.wickets);
      setTotalBalls(data.balls);
    }
  }, []);

  // Socket updates
  useEffect(() => {
    const handleMessage = (data) => {
      setBattingTeam(data.battingTeam || "N/A");
      setBowlingTeam(data.bowlingTeam || "N/A");
      setCurrentRun(data.runs || 0);
      setCurrentWicket(data.wickets || 0);
      setTotalBalls(data.balls || 0);
      setIningsOver(data.iningsOver);
      setBattingTeamWon(data.battingTeamWon);
      setBowlingTeamWon(data.bowlingTeamWon);
      setTarget(data.target);
      setBowlingStarted(data.bowlingStarted)
    };

    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  // Store live data in session
  useEffect(() => {
    const liveSecondInningsData = {
      bowlingTeam,
      battingTeam,
      runs: currentRun,
      balls: totalBalls,
      wickets: currentWicket
    };
    sessionStorage.setItem('liveFirstInningsData', JSON.stringify(liveSecondInningsData));
  }, [totalBalls, currentRun, currentWicket]);

  // Calculate overs
  useEffect(() => {
    const over = Math.floor(totalBalls / 6);
    const balls = totalBalls % 6;
    setOvers(`${over}.${balls}`);
  }, [totalBalls]);

  return (
    <div>
      {bowlingStarted ? (<div className='text-3xl font-bold flex justify-around mt-7'>
        <div>{battingTeam}</div>
        <div>{`${currentRun}/${currentWicket}`}</div>
        <div>{`Balls: ${totalBalls}`}</div>
      </div>): (<div className='text-3xl font-bold flex justify-around mt-7'>
        <div>{`Target:${target}`}</div>
        <div>{`${bowlingTeam} will bowl`}</div>
      </div>)}

      {battingTeamWon ? (
        <h3 className='flex justify-center text-4xl font-bold mt-12 text-indigo-700'>{`${battingTeam} Won`}</h3>
      ) : bowlingTeamWon ? (
        <h3 className='flex justify-center text-4xl font-bold mt-12 text-indigo-700'>{`${bowlingTeam} Won`}</h3>
      ) : !bowlingStarted ? (
        <h3 className='flex justify-center text-4xl font-bold mt-12 text-indigo-700'>{`Match not yet started`}</h3>
      ): (
        <div>
          <Title text={`Over: ${overs}`} className='mt-5' />
          <Title text={`${bowlingTeam} will bowl`} className='mt-5' />
          <Title text={`Target: ${target}`} className='mt-5' />
        </div>
      )}
    </div>
  );
};

export default SecondInnings;
