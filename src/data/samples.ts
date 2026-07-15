export interface Sample {
  id: string;
  label: string;
  text: string;
}

/** Preset paragraphs for the "try an example" control. */
export const samples: Sample[] = [
  {
    id: "marketing-copy",
    label: "Marketing copy",
    text: `In today's fast-paced world, it's important to note that our platform boasts a robust, seamless design. Furthermore, it fosters a comprehensive, holistic approach to productivity, whether you're a startup founder or an enterprise leader. In conclusion, this innovative, game-changing tool will revolutionize the way your team collaborates.`,
  },
  {
    id: "plain-update",
    label: "Plain status update",
    text: `We shipped the login page yesterday and fixed the bug where the submit button stayed disabled after a failed password check. Sarah noticed the error message was cut off on small screens, so I widened the box and added a scroll fallback. Tests pass locally.`,
  },
];
