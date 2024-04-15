import React, { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import '../../App.css';
import './Ranking.css';

export default function Ranking() {

    return (
        <div className='ranking-container'>
            <video src='/videos/ranking.mp4' autoPlay loop muted playsInline data-testid="ranking" />
            <h1 className='ranking'>Ranking</h1>
            <div className="users-table">
                <table>
                    <tr>
                        <th>Rank</th>
                        <th>Player Name</th>
                        <th>Score</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Player 1</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Player 2</td>
                        <td>950</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Player 3</td>
                        <td>900</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Player 1</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>Player 1</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>Player 1</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>Player 1</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>Player 1</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>Player 1</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>10</td>
                        <td>Player 1</td>
                        <td>1000</td>
                    </tr>
                </table>
            </div>
        </div>
    );
}
