import random
import string

def random_str(count):
    """ generate a random string for token """
    return ''.join(random.SystemRandom().choice(string.ascii_uppercase + 
                                                string.ascii_lowercase +
                                                string.digits) for _ in range(count) )