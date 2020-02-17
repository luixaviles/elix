// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import DarkModeMixin from "../base/DarkModeMixin.js";
import Button from "../base/Button.js";

/**
 * Arrow button component in the Plain reference design system
 *
 * @inherits Button
 * @mixes DarkModeMixin
 */
export default class PlainArrowDirectionButton extends DarkModeMixin(Button) {}
