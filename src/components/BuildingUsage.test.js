import { fireEvent, render, screen, within } from '@testing-library/react';
import BuildingUsage from './BuildingUsage';

const facilities = [
  {
    name: 'CommunityCentre',
    label: 'Community Centre',
    icon: '/icons/communitycentre.png',
    costPerUnit: 400,
    count: 2,
    totalCost: 800,
  },
  {
    name: 'PoliceStation',
    label: 'Police Station',
    icon: '/icons/policestation.png',
    costPerUnit: 600,
    count: 0,
    totalCost: 0,
  },
];

test('shows used facilities with readable labels and budget progress', () => {
  render(
    <BuildingUsage
      facilities={facilities}
      totalUsedBudget={800}
      budgetLimit={10000}
      onLocate={jest.fn()}
      onRemoveOne={jest.fn()}
      onRemoveAll={jest.fn()}
    />
  );

  expect(
    screen.getByText('Community Centre', { selector: 'strong' })
  ).toBeInTheDocument();
  expect(screen.queryByText('CommunityCentre')).not.toBeInTheDocument();
  expect(screen.getByText('$400 each ·')).toBeInTheDocument();
  expect(screen.getByText('$800 total')).toBeInTheDocument();
  expect(screen.getByRole('progressbar', { name: 'Budget allocated' }))
    .toHaveAttribute('value', '800');
  expect(screen.getByText('Unused facility types (1)')).toBeInTheDocument();
});

test('connects locate and removal actions to a facility type', () => {
  const onLocate = jest.fn();
  const onRemoveOne = jest.fn();
  const onRemoveAll = jest.fn();

  render(
    <BuildingUsage
      facilities={facilities}
      totalUsedBudget={800}
      budgetLimit={10000}
      onLocate={onLocate}
      onRemoveOne={onRemoveOne}
      onRemoveAll={onRemoveAll}
    />
  );

  const usageRegion = screen.getByRole('region', { name: 'Building Usage' });
  fireEvent.click(
    within(usageRegion).getByRole('button', { name: 'Locate Community Centre' })
  );
  fireEvent.click(
    within(usageRegion).getByRole('button', {
      name: 'Remove one Community Centre',
    })
  );
  fireEvent.click(
    within(usageRegion).getByRole('button', {
      name: 'Remove all Community Centre',
    })
  );

  expect(onLocate).toHaveBeenCalledWith('CommunityCentre');
  expect(onRemoveOne).toHaveBeenCalledWith('CommunityCentre');
  expect(onRemoveAll).toHaveBeenCalledWith('CommunityCentre');
});

test('shows an empty-plan instruction and keeps unused types collapsed', () => {
  render(
    <BuildingUsage
      facilities={facilities.map((facility) => ({
        ...facility,
        count: 0,
        totalCost: 0,
      }))}
      totalUsedBudget={0}
      budgetLimit={10000}
      onLocate={jest.fn()}
      onRemoveOne={jest.fn()}
      onRemoveAll={jest.fn()}
    />
  );

  expect(
    screen.getByText(/place it on the map to start your plan/i)
  ).toBeInTheDocument();
  expect(screen.getByText('Unused facility types (2)')).toBeInTheDocument();
});
