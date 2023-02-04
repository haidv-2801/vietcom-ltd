import React, { useState } from 'react';
import '@react-page/editor/lib/index.css';
// The editor core
import Editor from '@react-page/editor';

// import the main css, uncomment this: (this is commented in the example because of https://github.com/vercel/next.js/issues/19717)
// import '@react-page/editor/lib/index.css';

// The rich text area plugin
import slate from '@react-page/plugins-slate';

// image
// import image from '@react-page/plugins-image';

// Stylesheets for the rich text area plugin
// uncomment this
//import '@react-page/plugins-slate/lib/index.css';

// Stylesheets for the imagea plugin
//import '@react-page/plugins-image/lib/index.css';

// Define which plugins we want to use.
const cellPlugins = [slate()];

function ReactPage() {
  const [value, setValue] = useState(null);

  return (
    <div>
      <Editor cellPlugins={cellPlugins} value={value} onChange={setValue} />
    </div>
  );
}

export default ReactPage;
