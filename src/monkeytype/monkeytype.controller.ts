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
	<image x="120" y="5%" width="50" height="50" href="data:image/svg+xml;base64,CiAgICAgICAgICAgIDxzdmcKICAgICAgICAgICAgICAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgICAgICAgICAgICAgIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIgogICAgICAgICAgICAgICAgc3R5bGU9Imlzb2xhdGlvbjogaXNvbGF0ZSIKICAgICAgICAgICAgICAgIHZpZXdCb3g9Ii02ODAgLTEwMzAgMzAwIDE4MCIKICAgICAgICAgICAgPgogICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8cGF0aCBmaWxsPSIjZmZmIgogICAgICAgICAgICAgICAgICAgIGQ9Ik0gLTQzMCAtOTEwIEwgLTQzMCAtOTEwIEMgLTQyNC40ODEgLTkxMCAtNDIwIC05MDUuNTE5IC00MjAgLTkwMCBMIC00MjAgLTkwMCBDIC00MjAgLTg5NC40ODEgLTQyNC40ODEgLTg5MCAtNDMwIC04OTAgTCAtNDMwIC04OTAgQyAtNDM1LjUxOSAtODkwIC00NDAgLTg5NC40ODEgLTQ0MCAtOTAwIEwgLTQ0MCAtOTAwIEMgLTQ0MCAtOTA1LjUxOSAtNDM1LjUxOSAtOTEwIC00MzAgLTkxMCBaIgogICAgICAgICAgICAgICAgLz4KICAgICAgICAgICAgICAgIDxwYXRoIGZpbGw9IiNmZmYiCiAgICAgICAgICAgICAgICAgICAgZD0iIE0gLTU3MCAtOTEwIEwgLTUxMCAtOTEwIEMgLTUwNC40ODEgLTkxMCAtNTAwIC05MDUuNTE5IC01MDAgLTkwMCBMIC01MDAgLTkwMCBDIC01MDAgLTg5NC40ODEgLTUwNC40ODEgLTg5MCAtNTEwIC04OTAgTCAtNTcwIC04OTAgQyAtNTc1LjUxOSAtODkwIC01ODAgLTg5NC40ODEgLTU4MCAtOTAwIEwgLTU4MCAtOTAwIEMgLTU4MCAtOTA1LjUxOSAtNTc1LjUxOSAtOTEwIC01NzAgLTkxMCBaICIKICAgICAgICAgICAgICAgIC8+CiAgICAgICAgICAgICAgICA8cGF0aCBmaWxsPSIjZmZmIgogICAgICAgICAgICAgICAgICAgIGQ9Ik0gLTU5MCAtOTcwIEwgLTU5MCAtOTcwIEMgLTU4NC40ODEgLTk3MCAtNTgwIC05NjUuNTE5IC01ODAgLTk2MCBMIC01ODAgLTk0MCBDIC01ODAgLTkzNC40ODEgLTU4NC40ODEgLTkzMCAtNTkwIC05MzAgTCAtNTkwIC05MzAgQyAtNTk1LjUxOSAtOTMwIC02MDAgLTkzNC40ODEgLTYwMCAtOTQwIEwgLTYwMCAtOTYwIEMgLTYwMCAtOTY1LjUxOSAtNTk1LjUxOSAtOTcwIC01OTAgLTk3MCBaIgogICAgICAgICAgICAgICAgLz4KICAgICAgICAgICAgICAgIDxwYXRoIGZpbGw9IiNmZmYiCiAgICAgICAgICAgICAgICAgICAgZD0iIE0gLTYzOS45OTEgLTk2MC41MTUgQyAtNjM5LjcyIC05NzYuODM2IC02MjYuMzg1IC05OTAgLTYxMCAtOTkwIEwgLTYxMCAtOTkwIEMgLTYwMi4zMiAtOTkwIC01OTUuMzEgLTk4Ny4xMDggLTU5MCAtOTgyLjM1NSBDIC01ODQuNjkgLTk4Ny4xMDggLTU3Ny42OCAtOTkwIC01NzAgLTk5MCBMIC01NzAgLTk5MCBDIC01NTMuNjE1IC05OTAgLTU0MC4yOCAtOTc2LjgzNiAtNTQwLjAwOSAtOTYwLjUxNSBDIC01NDAuMDAxIC05NjAuMzQ1IC01NDAgLTk2MC4xNzIgLTU0MCAtOTYwIEwgLTU0MCAtOTYwIEwgLTU0MCAtOTQwIEMgLTU0MCAtOTM0LjQ4MSAtNTQ0LjQ4MSAtOTMwIC01NTAgLTkzMCBMIC01NTAgLTkzMCBDIC01NTUuNTE5IC05MzAgLTU2MCAtOTM0LjQ4MSAtNTYwIC05NDAgTCAtNTYwIC05NjAgTCAtNTYwIC05NjAgQyAtNTYwIC05NjUuNTE5IC01NjQuNDgxIC05NzAgLTU3MCAtOTcwIEMgLTU3NS41MTkgLTk3MCAtNTgwIC05NjUuNTE5IC01ODAgLTk2MCBMIC01ODAgLTk2MCBMIC01ODAgLTk2MCBMIC01ODAgLTk0MCBDIC01ODAgLTkzNC40ODEgLTU4NC40ODEgLTkzMCAtNTkwIC05MzAgTCAtNTkwIC05MzAgQyAtNTk1LjUxOSAtOTMwIC02MDAgLTkzNC40ODEgLTYwMCAtOTQwIEwgLTYwMCAtOTYwIEwgLTYwMCAtOTYwIEwgLTYwMCAtOTYwIEwgLTYwMCAtOTYwIEwgLTYwMCAtOTYwIEwgLTYwMCAtOTYwIEwgLTYwMCAtOTYwIEwgLTYwMCAtOTYwIEMgLTYwMCAtOTY1LjUxOSAtNjA0LjQ4MSAtOTcwIC02MTAgLTk3MCBDIC02MTUuNTE5IC05NzAgLTYyMCAtOTY1LjUxOSAtNjIwIC05NjAgTCAtNjIwIC05NjAgTCAtNjIwIC05NDAgQyAtNjIwIC05MzQuNDgxIC02MjQuNDgxIC05MzAgLTYzMCAtOTMwIEwgLTYzMCAtOTMwIEMgLTYzNS41MTkgLTkzMCAtNjQwIC05MzQuNDgxIC02NDAgLTk0MCBMIC02NDAgLTk2MCBMIC02NDAgLTk2MCBDIC02NDAgLTk2MC4xNzIgLTYzOS45OTYgLTk2MC4zNDQgLTYzOS45OTEgLTk2MC41MTUgWiAiCiAgICAgICAgICAgICAgICAvPgogICAgICAgICAgICAgICAgPHBhdGggZmlsbD0iI2ZmZiIKICAgICAgICAgICAgICAgICAgICBkPSIgTSAtNDYwIC05MzAgTCAtNDYwIC05MDAgQyAtNDYwIC04OTQuNDgxIC00NjQuNDgxIC04OTAgLTQ3MCAtODkwIEwgLTQ3MCAtODkwIEMgLTQ3NS41MTkgLTg5MCAtNDgwIC04OTQuNDgxIC00ODAgLTkwMCBMIC00ODAgLTkzMCBMIC01MDguODIgLTkzMCBDIC01MTQuOTkgLTkzMCAtNTIwIC05MzQuNDgxIC01MjAgLTk0MCBMIC01MjAgLTk0MCBDIC01MjAgLTk0NS41MTkgLTUxNC45OSAtOTUwIC01MDguODIgLTk1MCBMIC00MzEuMTggLTk1MCBDIC00MjUuMDEgLTk1MCAtNDIwIC05NDUuNTE5IC00MjAgLTk0MCBMIC00MjAgLTk0MCBDIC00MjAgLTkzNC40ODEgLTQyNS4wMSAtOTMwIC00MzEuMTggLTkzMCBMIC00NjAgLTkzMCBaICIKICAgICAgICAgICAgICAgIC8+CiAgICAgICAgICAgICAgICA8cGF0aCBmaWxsPSIjZmZmIgogICAgICAgICAgICAgICAgICAgIGQ9Ik0gLTQ3MCAtOTkwIEwgLTQzMCAtOTkwIEMgLTQyNC40ODEgLTk5MCAtNDIwIC05ODUuNTE5IC00MjAgLTk4MCBMIC00MjAgLTk4MCBDIC00MjAgLTk3NC40ODEgLTQyNC40ODEgLTk3MCAtNDMwIC05NzAgTCAtNDcwIC05NzAgQyAtNDc1LjUxOSAtOTcwIC00ODAgLTk3NC40ODEgLTQ4MCAtOTgwIEwgLTQ4MCAtOTgwIEMgLTQ4MCAtOTg1LjUxOSAtNDc1LjUxOSAtOTkwIC00NzAgLTk5MCBaIgogICAgICAgICAgICAgICAgLz4KICAgICAgICAgICAgICAgIDxwYXRoIGZpbGw9IiNmZmYiCiAgICAgICAgICAgICAgICAgICAgZD0iIE0gLTYzMCAtOTEwIEwgLTYxMCAtOTEwIEMgLTYwNC40ODEgLTkxMCAtNjAwIC05MDUuNTE5IC02MDAgLTkwMCBMIC02MDAgLTkwMCBDIC02MDAgLTg5NC40ODEgLTYwNC40ODEgLTg5MCAtNjEwIC04OTAgTCAtNjMwIC04OTAgQyAtNjM1LjUxOSAtODkwIC02NDAgLTg5NC40ODEgLTY0MCAtOTAwIEwgLTY0MCAtOTAwIEMgLTY0MCAtOTA1LjUxOSAtNjM1LjUxOSAtOTEwIC02MzAgLTkxMCBaICIKICAgICAgICAgICAgICAgIC8+CiAgICAgICAgICAgICAgICA8cGF0aCBmaWxsPSIjZmZmIgogICAgICAgICAgICAgICAgICAgIGQ9IiBNIC01MTUgLTk5MCBMIC01MTAgLTk5MCBDIC01MDQuNDgxIC05OTAgLTUwMCAtOTg1LjUxOSAtNTAwIC05ODAgTCAtNTAwIC05ODAgQyAtNTAwIC05NzQuNDgxIC01MDQuNDgxIC05NzAgLTUxMCAtOTcwIEwgLTUxNSAtOTcwIEMgLTUyMC41MTkgLTk3MCAtNTI1IC05NzQuNDgxIC01MjUgLTk4MCBMIC01MjUgLTk4MCBDIC01MjUgLTk4NS41MTkgLTUyMC41MTkgLTk5MCAtNTE1IC05OTAgWiAiCiAgICAgICAgICAgICAgICAvPgogICAgICAgICAgICAgICAgPHBhdGggZmlsbD0iI2ZmZiIKICAgICAgICAgICAgICAgICAgICBkPSIgTSAtNjYwIC05MTAgTCAtNjgwIC05MTAgTCAtNjgwIC05ODAgQyAtNjgwIC0xMDA3LjU5NiAtNjU3LjU5NiAtMTAzMCAtNjMwIC0xMDMwIEwgLTQzMCAtMTAzMCBDIC00MDIuNDA0IC0xMDMwIC0zODAgLTEwMDcuNTk2IC0zODAgLTk4MCBMIC0zODAgLTkwMCBDIC0zODAgLTg3Mi40MDQgLTQwMi40MDQgLTg1MCAtNDMwIC04NTAgTCAtNjMwIC04NTAgQyAtNjU3LjU5NiAtODUwIC02ODAgLTg3Mi40MDQgLTY4MCAtOTAwIEwgLTY4MCAtOTIwIEwgLTY2MCAtOTIwIEwgLTY2MCAtOTAwIEMgLTY2MCAtODgzLjQ0MyAtNjQ2LjU1NyAtODcwIC02MzAgLTg3MCBMIC00MzAgLTg3MCBDIC00MTMuNDQzIC04NzAgLTQwMCAtODgzLjQ0MyAtNDAwIC05MDAgTCAtNDAwIC05ODAgQyAtNDAwIC05OTYuNTU3IC00MTMuNDQzIC0xMDEwIC00MzAgLTEwMTAgTCAtNjMwIC0xMDEwIEMgLTY0Ni41NTcgLTEwMTAgLTY2MCAtOTk2LjU1NyAtNjYwIC05ODAgTCAtNjYwIC05MTAgWiAiCiAgICAgICAgICAgICAgICAvPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L3N2Zz4KICAgICAgICA=" />
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
