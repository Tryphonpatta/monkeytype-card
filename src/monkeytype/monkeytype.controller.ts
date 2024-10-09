import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express'; // Use Express response
import { MonkeytypeService } from './monkeytype.service';

@Controller('monkeytype')
export class MonkeytypeController {
  constructor(private readonly monkeytypeService: MonkeytypeService) {}

  @Get('card')
  async getMonkeytypeCard(
    @Query('username') username: string,
    @Res() res: Response,
  ) {
    if (!username) {
      return res.status(400).send('Username is required');
    }

    const data = await this.monkeytypeService.getStats(username);
    const typingStats = data.data.typingStats;
    const personalBests = data.data.personalBests;
    const allTimeLbs = data.data.allTimeLbs;
    const allTime15s = allTimeLbs?.['time']?.['15']?.['english']?.['rank']
      ? allTimeLbs?.['time']?.['15']?.['english']?.['rank']
      : 'N/A';
    const allTime30s = allTimeLbs?.['time']?.['30']?.['english']?.['rank']
      ? allTimeLbs?.['time']?.['30']?.['english']?.['rank']
      : 'N/A';
    const allTime60s = allTimeLbs?.['time']?.['60']?.['english']?.['rank']
      ? allTimeLbs?.['time']?.['60']?.['english']?.['rank']
      : 'N/A';

    const bestWpm15 = personalBests?.time?.['15']?.[0]?.wpm ?? 'N/A';
    const bestWpm30 = personalBests?.time?.['30']?.[0]?.wpm ?? 'N/A';
    const bestWpm60 = personalBests?.time?.['60']?.[0]?.wpm ?? 'N/A';

    const timeTyping = typingStats?.timeTyping ?? 0;
    const hoursTyping = Math.floor(timeTyping / 3600);
    const minutesTyping = Math.floor((timeTyping % 3600) / 60);

    const svgCard = `<svg width="450" height="250" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect width="450" height="250" fill="url(#grad1)" rx="20" ry="20"/>

    <!-- Gradient Background Definition -->
    <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#153448;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3C5B6F;stop-opacity:1" />
        </linearGradient>
    </defs>

    <!-- Monkeytype Logo -->
	<image x="120" y="5%" width="50" height="50" href="https://raw.githubusercontent.com/monkeytype-hub/monkeytype-icon/210812d15c9e6399115a4bdeb49bd950770dbb63/monkeytype-icon/logo-svg/mizu.svg" />
	<!-- Replace with actual logo -->

    <!-- Title -->
    <text x="250" y="15%" font-family='"Kanit", sans-serif' font-size="16" font-weight="700" fill="#DFD0B8" text-anchor="middle" alignment-baseline="central">MONKEYTYPE</text>

    <!-- Stats Section -->
    <text x="50" y="40%" font-family='"Kanit", sans-serif' font-size="16" font-weight="500" fill="#DFD0B8">15 S</text>
    <text x="160" y="40%" font-family='"Kanit", sans-serif' font-size="16" font-weight="500" fill="#DFD0B8">${bestWpm15}</text>
    <text x="230" y="40%" font-family='"Kanit", sans-serif' font-size="16" fill="#DFD0B8" >wpm</text>
    <text x="350" y="40%" font-family='"Kanit", sans-serif' font-size="16" fill="#DFD0B8">#${allTime15s}</text>

	<text x="50" y="55%" font-family='"Kanit", sans-serif' font-size="16" font-weight="500" fill="#DFD0B8">30 S</text>
    <text x="160" y="55%" font-family='"Kanit", sans-serif' font-size="16" font-weight="500" fill="#DFD0B8">${bestWpm30}</text>
    <text x="230" y="55%" font-family='"Kanit", sans-serif' font-size="16" fill="#DFD0B8" >wpm</text>
    <text x="350" y="55%" font-family='"Kanit", sans-serif' font-size="16" fill="#DFD0B8">#${allTime30s}</text>

	<text x="50" y="70%" font-family='"Kanit", sans-serif' font-size="16" font-weight="500" fill="#DFD0B8">30 S</text>
    <text x="160" y="70%" font-family='"Kanit", sans-serif' font-size="16" font-weight="500" fill="#DFD0B8">${bestWpm60}</text>
    <text x="230" y="70%" font-family='"Kanit", sans-serif' font-size="16" fill="#DFD0B8" >wpm</text>
    <text x="350" y="70%" font-family='"Kanit", sans-serif' font-size="16" fill="#DFD0B8">#${allTime60s}</text>

    <text x="50" y="85%" font-family='"Kanit", sans-serif' font-size="16" font-weight="500" fill="#DFD0B8">Time Typing</text>
    <text x="160" y="85%" font-family='"Kanit", sans-serif' font-size="16" font-weight="500" fill="#DFD0B8">${hoursTyping}h ${minutesTyping}m</text>

    <!-- Shadow Effect -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="3" dy="3" stdDeviation="5" flood-color="#000"/>
    </filter>
</svg>
`;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svgCard);
  }
}
