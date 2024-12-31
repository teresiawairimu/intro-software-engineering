import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';



jest.mock('../components/NavBarComponent', () => () => <div data-testid="navbar-component">Navbar</div>);
jest.mock('../components/MoodPickerCard', () => () => <div data-testid="mood-picker-card">Mood Picker Card</div>);

describe('DashboardPage', () => {
  it('renders the NavbarComponent', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    const navbar = screen.getByTestId('navbar-component');
    expect(navbar).toBeInTheDocument();
  });

  it('renders the MoodPickerCard inside a container', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    const moodPickerCard = screen.getByTestId('mood-picker-card');
    expect(moodPickerCard).toBeInTheDocument();
  });
});
