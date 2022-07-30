<script setup lang="ts">

import {ref} from "vue";
import {ITextarea} from "@inkline/inkline"
import {SimpleICSGenerator} from "./lib/ICSGenerator";
import {JodaTimeHelper} from "./lib/TimeHelper";
import {Instant, LocalDate, nativeJs, ZoneId} from "@js-joda/core";
import {SimpleMapper} from "./lib/Mapper";
import {RealConverter} from "./lib/Converter";
import {core} from "./main";
import {TimetableEvent} from "./lib/TimetableEvent";
import {ICalEventData} from "ical-generator";

const input = ref("");
const date = ref("2022-08-08")

function createICS() {
  const d = date.value
  const tz = ZoneId.of("Singapore");
  const localDate = LocalDate.parse(d);
  const timeHelper = new JodaTimeHelper(localDate);
  const ics = new SimpleICSGenerator(timeHelper);
  const mapper = new SimpleMapper();
  const converter = new RealConverter(core);
  const courses = converter.Parse(input.value);
  const events = courses
      .Map(c => converter.Convert(c))
      .Map(c => mapper.MapTimeTable(c))
      .Flatten<TimetableEvent>();
  const ical = ics.Create(events);
  const a = window.document.createElement('a');
  a.href = window.URL.createObjectURL(ical);
  a.download = 'timetable.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

</script>

<template>
  <div>
    <div class="bg"></div>
    <div class="bg bg2"></div>
    <div class="bg bg3"></div>
    <i-header fullscreen class="_text-align:center" style="background: rgba(0,0,0,0)">
      <div class="_margin:2">
        <img src="./assets/CoralCal.svg" width="128">
        <h1>CoralCal</h1>
        <h5>Generates ICS calendar format from your NTU timetable!</h5>
      </div>

      <i-alert color="info" class="_margin-y:2">
        <template #icon>
          <i-icon name="ink-info" />
        </template>
        <p>1. Go to your Degree Audit</p>
        <p>2. Scroll down and click <code>View Course timetable</code></p>
        <p>3. Copy all your time table information, exclude the header row</p>
        <p>4. Select any date that is Week 1 of the semester</p>
        <p>5. Paste your calendar on the text area</p>
        <p>6. Enjoy!</p>

      </i-alert>

      <i-input v-model="date" type="date" placeholder="Enter a date..">
          <template #prefix ><p class="_color:secondary _font-size:lg">Enter the date of any day in Week 1</p></template>
      </i-input>
      <i-textarea v-model="input" placeholder="Input NTU timetable here..." style="height: 350px"/>
      <i-button
          color="primary" block
          class="_margin-top:2 _margin-bottom:4"
          @click="createICS"
      >Generate calendar</i-button>
      <div class="_position:fixed _display:block _background:dark footer _padding:1 _font-size:lg" >Made by <a  href="https://kirinnee.dev" >Ernest Ng</a>. Please help me star my repository on <a href="https://github.com/kirinnee">GitHub</a> if this helped you! Feel free to contact me if this isn't working.</div>
    </i-header>

  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.footer {
  left:0;
  bottom: 0;
  width: 100vw;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.bg {
  animation: slide 6s ease-in-out infinite alternate;
  background-image: linear-gradient(-60deg, #ffce31 50%, #ff3030 50%);
  bottom: 0;
  left: -50%;
  opacity: .5;
  position: fixed;
  right: -50%;
  top: 0;
  z-index: -1;
}

.bg2 {
  animation-direction: alternate-reverse;
  animation-duration: 8s;
}

.bg3 {
  animation-duration: 10s;
}

@keyframes slide {
  0% {
    transform: translateX(-25%);
  }
  100% {
    transform: translateX(25%);
  }
}

</style>
