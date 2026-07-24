import { fireEvent, render, screen } from '@testing-library/react';
import AppModal from './AppModal';

test('renders an accessible modal in a portal and focuses it', () => {
  render(
    <AppModal
      isOpen
      onRequestClose={jest.fn()}
      contentLabel="Example modal"
      overlayClassName="overlay"
      className="content"
    >
      <p>Modal content</p>
    </AppModal>
  );

  const dialog = screen.getByRole('dialog', { name: 'Example modal' });
  expect(dialog).toHaveFocus();
  expect(dialog).toHaveClass('content');
  expect(dialog.parentElement).toHaveClass('overlay');
});

test('closes with Escape and a direct overlay click', () => {
  const onRequestClose = jest.fn();
  render(
    <AppModal
      isOpen
      onRequestClose={onRequestClose}
      contentLabel="Example modal"
      overlayClassName="overlay"
      className="content"
    >
      <button type="button">Inside</button>
    </AppModal>
  );

  fireEvent.keyDown(document, { key: 'Escape' });
  fireEvent.mouseDown(screen.getByRole('dialog').parentElement);
  fireEvent.mouseDown(screen.getByRole('button', { name: 'Inside' }));

  expect(onRequestClose).toHaveBeenCalledTimes(2);
});

test('restores focus when the modal closes', () => {
  const { rerender } = render(
    <>
      <button type="button">Open trigger</button>
      <AppModal
        isOpen={false}
        onRequestClose={jest.fn()}
        contentLabel="Example modal"
        overlayClassName="overlay"
        className="content"
      >
        Content
      </AppModal>
    </>
  );
  const trigger = screen.getByRole('button', { name: 'Open trigger' });
  trigger.focus();

  rerender(
    <>
      <button type="button">Open trigger</button>
      <AppModal
        isOpen
        onRequestClose={jest.fn()}
        contentLabel="Example modal"
        overlayClassName="overlay"
        className="content"
      >
        Content
      </AppModal>
    </>
  );
  rerender(
    <>
      <button type="button">Open trigger</button>
      <AppModal
        isOpen={false}
        onRequestClose={jest.fn()}
        contentLabel="Example modal"
        overlayClassName="overlay"
        className="content"
      >
        Content
      </AppModal>
    </>
  );

  expect(screen.getByRole('button', { name: 'Open trigger' })).toHaveFocus();
});
