import numpy as np


def gcc_phat(signal_1, signal_2):
    """
    Estimate the relative time delay between two signals
    using Generalized Cross-Correlation with Phase Transform.
    """

    signal_1 = np.asarray(signal_1, dtype=float)
    signal_2 = np.asarray(signal_2, dtype=float)

    n = signal_1.size + signal_2.size

    signal_1_fft = np.fft.rfft(
        signal_1,
        n=n
    )

    signal_2_fft = np.fft.rfft(
        signal_2,
        n=n
    )

    cross_spectrum = (
            signal_1_fft *
            np.conj(signal_2_fft)
    )

    magnitude = np.abs(cross_spectrum)

    cross_spectrum /= (
            magnitude + 1e-10
    )

    correlation = np.fft.irfft(
        cross_spectrum,
        n=n
    )

    correlation = np.concatenate(
        (
            correlation[-(n // 2):],
            correlation[:n // 2]
        )
    )

    delay = (
            np.argmax(correlation)
            - n // 2
    )

    return int(delay)


def estimate_direction(
        signal_1,
        signal_2,
        tolerance=1
):
    """
    Convert the estimated delay into
    LEFT, CENTER, or RIGHT.

    The sign convention must be verified
    using known test signals.
    """

    delay = gcc_phat(
        signal_1,
        signal_2
    )

    if delay < -tolerance:
        direction = "LEFT"

    elif delay > tolerance:
        direction = "RIGHT"

    else:
        direction = "CENTER"

    return direction