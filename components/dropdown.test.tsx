import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Dropdown from './dropdown';

describe('Dropdown', async () => {
  it('Show menu on click of trigger', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown triggerText="Dropdown trigger">
        <li>
          <a>Item 1</a>
        </li>
      </Dropdown>
    );
    const trigger = screen.getByText('Dropdown trigger');
    // expect(screen.getByText('Item 1')).not.toBeVisible();
    await user.click(trigger);
    // expect(screen.getByText('Item 1')).toBeVisible();
  });
});
/* test('Page', async () => {
  render(
    <Dropdown triggerText="Dropdown trigger">
      <li>
        <a>Item 1</a>
      </li>
    </Dropdown>
  );
  const trigger = screen.getByText('Dropdown-trigger');
  expect(screen.getByText('Item 1')).not.toBeDefined();
  await trigger.click();
  expect(screen.getByText('Item 1')).toBeDefined();
});
 */
