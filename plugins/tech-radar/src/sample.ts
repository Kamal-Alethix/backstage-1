/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  RadarRing,
  RadarQuadrant,
  RadarEntry,
  TechRadarLoaderResponse,
  TechRadarApi,
} from './api';

const rings = new Array<RadarRing>();
rings.push({ id: 'adopt', name: 'ADOPT', color: '#93c47d' });
rings.push({ id: 'trial', name: 'TRIAL', color: '#93d2c2' });
rings.push({ id: 'assess', name: 'ASSESS', color: '#fbdb84' });
rings.push({ id: 'hold', name: 'HOLD', color: '#efafa9' });

const quadrants = new Array<RadarQuadrant>();
quadrants.push({ id: 'infrastructure', name: 'Infrastructure' });
quadrants.push({ id: 'frameworks', name: 'Frameworks' });
quadrants.push({ id: 'languages', name: 'Languages' });
quadrants.push({ id: 'process', name: 'Process' });

const entries = new Array<RadarEntry>();
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: 'adopt',
      date: new Date('2022-03-01'),
      description:
        'Recommended Teach Stack for EGIS II backend Microservice Development',
    },
  ],
  url: 'https://openjdk.java.net/',
  key: 'Java',
  id: 'Java Platform Standard Edition 18',
  title: 'Java',
  quadrant: 'languages',
  description:
    'Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible',
});
entries.push({
  timeline: [
    {
      moved: -1,
      ringId: 'adopt',
      date: new Date('2022-04-26'),
      description:
        'Recommended Teach Stack for EGIS II User Interface Development',
    },
  ],
  url: 'https://reactjs.org/',
  key: 'React',
  id: 'React 18.1.0',
  title: 'React',
  quadrant: 'languages',
  description:
    'React is a free and open-source front-end JavaScript library for building user interfaces based on UI components',
});
entries.push({
  timeline: [
    {
      moved: 1,
      ringId: 'adopt',
      date: new Date('2020-08-06'),
      description:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
    },
  ],
  url: 'https://webpack.js.org/',
  key: 'Spring',
  id: 'Spring 2.7.0',
  title: 'Spring Framework',
  quadrant: 'frameworks',
});
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: 'adopt',
      date: new Date('2020-08-06'),
    },
  ],
  url: 'https://reactjs.org/',
  key: 'react',
  id: 'react',
  title: 'React',
  quadrant: 'frameworks',
});
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: 'adopt',
      date: new Date('2020-08-06'),
    },
  ],
  url: '#',
  key: 'code-reviews',
  id: 'code-reviews',
  title: 'Code Reviews',
  quadrant: 'process',
});
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: 'assess',
      date: new Date('2020-08-06'),
    },
  ],
  url: '#',
  key: 'mob-programming',
  id: 'mob-programming',
  title: 'Mob Programming',
  quadrant: 'process',
});
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: 'adopt',
      date: new Date('2020-08-06'),
    },
  ],
  url: '#',
  key: 'docs-like-code',
  id: 'docs-like-code',
  title: 'Docs-like-code',
  quadrant: 'process',
});
entries.push({
  timeline: [
    {
      ringId: 'hold',
      date: new Date('2020-08-06'),
    },
  ],
  url: '#',
  key: 'force-push',
  id: 'force-push',
  title: 'Force push to master',
  quadrant: 'process',
});
entries.push({
  timeline: [
    {
      ringId: 'adopt',
      date: new Date('2020-08-06'),
      description: 'long description',
    },
  ],
  url: 'https://github.com',
  key: 'github-actions',
  id: 'github-actions',
  title: 'GitHub Actions',
  quadrant: 'infrastructure',
});

export const mock: TechRadarLoaderResponse = {
  entries,
  quadrants,
  rings,
};

export class SampleTechRadarApi implements TechRadarApi {
  async load() {
    return mock;
  }
}
