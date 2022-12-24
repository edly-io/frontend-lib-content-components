import { StrictDict } from '../../utils';
import { buttons, plugins } from '../../data/constants/tinyMCE';

const mapToolbars = toolbars => toolbars.map(toolbar => toolbar.join(' ')).join(' | ');

const pluginConfig = (isLibrary) => {

  return (
    StrictDict({
      plugins: [
        plugins.link,
        plugins.lists,
        plugins.codesample,
        plugins.emoticons,
        plugins.table,
        plugins.hr,
        plugins.charmap,
        plugins.code,
        plugins.autoresize,
      ].join(' '),
      menubar: false,
      toolbar: mapToolbars([
        [buttons.undo, buttons.redo],
        [buttons.formatSelect],
        [buttons.bold, buttons.italic, buttons.underline, buttons.foreColor, buttons.backColor],
        [
          buttons.align.left,
          buttons.align.center,
          buttons.align.right,
          buttons.align.justify,
        ],
        [
          buttons.bullist,
          buttons.numlist,
          buttons.outdent,
          buttons.indent,
        ],
        [buttons.table, buttons.emoticons, buttons.charmap, buttons.hr],
        [buttons.removeFormat, buttons.code],
      ]),
      config: {
        branding: false,
        height: '100%',
        menubar: false,
        min_height: 500,
        toolbar_sticky: true,
        toolbar_sticky_offset: 76,
        relative_urls: true,
        convert_urls: false,
      },
    })
  );
};

export default pluginConfig;
